import { Response } from "express";
import {
  BadRequestException,
  Inject,
  Injectable,
  StreamableFile,
} from "@nestjs/common";
import { createReadStream } from "fs";
import { FileResponseDto } from "./dtos/file-response.dto";
import * as fs from "fs";
import "multer";
import * as Minio from "minio";
import * as sharp from "sharp";
import { firstValueFrom, timeout } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { v4 as uuidv4 } from "uuid";
@Injectable()
export class FileManagerService {
  // constructor(private readonly sftpClient: SftpClientService) {}
  private readonly minioClient: Minio.Client;
  private readonly minioPublicClient: Minio.Client;
  private readonly minioBucketName: string;
  private readonly minioPublicEndpoint: string;
  private readonly minioPort?: number;
  private readonly minioPublicPort?: number;
  private readonly minioUseSSL: boolean;
  private readonly minioPublicUseSSL: boolean;

  constructor(
    @Inject("DOCUMENTS_SERVICE")
    private documentsClient: ClientProxy
  ) {
    this.minioBucketName = process.env.MINIO_BUCKET_NAME;
    const minioEndpoint = this.cleanEnv(process.env.MINIO_ENDPOINT);
    this.minioPublicEndpoint =
      this.cleanEnv(process.env.MINIO_PUBLIC_ENDPOINT) || minioEndpoint;
    const minioAccessKey = this.cleanEnv(process.env.MINIO_ACCESS_KEY);
    const minioSecretKey = this.cleanEnv(process.env.MINIO_SECRET_KEY);
    const minioPort = Number(process.env.MINIO_PORT);
    const minioPublicPort = Number(process.env.MINIO_PUBLIC_PORT);
    this.minioPort = Number.isFinite(minioPort) && minioPort > 0 ? minioPort : undefined;
    this.minioUseSSL = this.cleanEnv(process.env.MINIO_USE_SSL).toLowerCase() === "true";
    const isPublicEndpointSeparate = this.normalizeEndpoint(this.minioPublicEndpoint) !== this.normalizeEndpoint(minioEndpoint);
    this.minioPublicPort =
      Number.isFinite(minioPublicPort) && minioPublicPort > 0
        ? minioPublicPort
        : isPublicEndpointSeparate
          ? undefined
          : this.minioPort;
    this.minioPublicUseSSL =
      this.cleanEnv(process.env.MINIO_PUBLIC_USE_SSL || process.env.MINIO_USE_SSL).toLowerCase() === "true";
    const config: any = {
      endPoint: minioEndpoint,
      accessKey: minioAccessKey,
      secretKey: minioSecretKey,
      useSSL: this.minioUseSSL,
    };

    if (this.minioPort) {
      config.port = this.minioPort;
    }

    this.minioClient = new Minio.Client(config);

		const publicConfig: Minio.ClientOptions = {
			endPoint: this.normalizeEndpoint(this.minioPublicEndpoint),
			accessKey: minioAccessKey,
			secretKey: minioSecretKey,
			useSSL: this.minioPublicUseSSL,
		};
		if (this.minioPublicPort) {
			publicConfig.port = this.minioPublicPort;
		}
		this.minioPublicClient = new Minio.Client(publicConfig);
  }

  private cleanEnv(value?: string): string {
    return `${value || ""}`.replace(/^['"]|['"]$/g, "");
  }

  private normalizeEndpoint(value: string): string {
    return value.replace(/^https?:\/\//, "").replace(/\/+$/g, "");
  }

  async downloadFile(
    file: FileResponseDto,
    basePath: string,
    response?: Response,
    deleteAfterCompleted = false
  ): Promise<StreamableFile> {
    // const downloadPath = await this.sftpClient.download(
    //   `${basePath}/${file.filename}`,
    //   file.path
    // );
    const downloadPath = `${basePath}/${file.filename}`;
    const readStream = createReadStream(downloadPath.toString());
    if (deleteAfterCompleted) {
      response.on("finish", async function () {
        readStream.destroy();
        fs.access(downloadPath, (err) => {
          if (!err) {
            fs.unlink(downloadPath, (err) => {});
          }
        });
      });
    }
    return new StreamableFile(readStream);
  }

  async uploadFile(
    file: Express.Multer.File,
    basePath: string
  ): Promise<FileResponseDto> {
    return await this.uploadToRemoteFileServer(file, basePath);
  }

  async uploadFiles(
    files: Express.Multer.File[],
    basePath: string
  ): Promise<FileResponseDto[]> {
    const responses: FileResponseDto[] = [];

    files.forEach(async (file) => {
      const response = await this.uploadToRemoteFileServer(file, basePath);
      responses.push(response);
    });

    return responses;
  }

  private async uploadToRemoteFileServer(
    file: Express.Multer.File,
    basePath: string
  ): Promise<FileResponseDto> {
    // const folderExists = await this.sftpClient.exists(basePath);
    // if (!folderExists) {
    //   await this.sftpClient.makeDirectory(basePath);
    // }

    // await this.sftpClient.upload(file.path, `${basePath}/${file.filename}`, {
    //   flags: 'w',
    //   encoding: null,
    //   mode: 0o666,
    // });

    //await fs.unlink(file.path);

    return new FileResponseDto(
      file.filename,
      file.path,
      file.originalname,
      file.mimetype,
      file.size
    );
  }
  async removeFile(file: FileResponseDto, basePath: string) {
    const filePath = `${basePath}/${file.filename}`;
    if (fs.existsSync(filePath)) {
      fs.access(filePath, (err) => {
        if (!err) {
          fs.unlink(filePath, (err) => {});
        }
      });
    }
  }
  //Minio
  async isMinioServerUp(): Promise<boolean> {
    try {
      // List buckets to check if server is up
      await this.minioClient.listBuckets();
      return true;
    } catch (error) {
      // if (error.code === "ECONNREFUSED") {
      // } else if (error.code === "AccessDenied") {
      // } else {
      // }
      return false;
    }
  }
  async getFromMinio(folderName: string, fileName: string): Promise<string> {
    const msg = {
      folderName: folderName,
      fileName: fileName,
    };
    try {
			const objectPath = [folderName, fileName].filter(Boolean).join("/");
			return await this.minioPublicClient.presignedGetObject(
				this.minioBucketName,
				objectPath,
				60 * 60
			);
    } catch (error) {
      try {
        const data = await firstValueFrom(
          this.documentsClient.send<string>("get-file", msg).pipe(timeout(10000))
        );
        return data;
      } catch (fallbackError) {
        console.error("Minio get error:", error);
        console.error("Documents get fallback error:", fallbackError);
        throw new Error("Failed to get file");
      }
    }
  }

  async getMimeType(folderName: string, fileName: string) {
    const msg = {
      folderName: folderName,
      fileName: fileName,
    };
    const mimeType = await firstValueFrom(
      this.documentsClient.send("get-mime-type", msg)
    );
    if (!mimeType) {
      throw new Error("Mimetype not found");
    }
    return mimeType;
  }
  async uploadToMinio(
    bucketName: string,
    fileName: string,
    file: string,
    size: number,
    fileType: string
  ): Promise<any> {
    const msg = {
      bucketName,
      fileName,
      file,
      size,
      fileType,
    };
    try {
      const data = await firstValueFrom(
        this.documentsClient.send<string>("upload-file", msg)
      );
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Upload faied");
    }
  }
  async uploadFileToMinio(
    bucketName: string,
    fileName: string,
    file: Buffer,
    size: number,
    fileType: string = "image/jpeg"
  ): Promise<any> {
    const msg = {
      bucketName,
      fileName,
      file,
      size,
      fileType,
    };
    try {
      await this.minioClient.putObject(
        bucketName,
        fileName,
        file,
        size,
        { "Content-Type": fileType }
      );
      return fileName;
    } catch (error) {
      try {
        const data = await firstValueFrom(
          this.documentsClient.send<string>("upload-file", msg).pipe(timeout(10000))
        );
        return data;
      } catch (fallbackError) {
        console.error("Minio upload error:", error);
        console.error("Documents upload fallback error:", fallbackError);
        throw new BadRequestException("Upload failed.");
      }
    }
  }
  async removeFromMinio(bucketName: string, filePath: string) {
    const msg = {
      bucketName,
      filePath,
    };
    try {
      const data = this.documentsClient.emit("remove-file", msg);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  async toJpeg(image: Buffer) {
    return await sharp(image).toFormat("jpeg").toBuffer();
  }
  async processImages(
    images: Buffer[],
    folderName: string,
    mimetype: string = "image/jpeg",
    size: number
  ): Promise<string[]> {
    const minioImages = [];
    for (const image of images) {
      // const processedThumbnail = await sharp(image).toFormat("jpeg").toBuffer();
      const filename = `${uuidv4()}`;
      await this.uploadFileToMinio(
        this.minioBucketName,
        `${folderName}/${filename}`,
        image,
        size,
        mimetype
      );
      minioImages.push(filename);
    }
    return minioImages;
  }
  async processImage(
    image: Buffer,
    folderName: string,
    mimetype: string = "image/jpeg",
    size: number
  ): Promise<string> {
    // const processedThumbnail = await sharp(image).toFormat("jpeg").toBuffer();
    const filename = `${uuidv4()}`;
    await this.uploadFileToMinio(
      this.minioBucketName,
      `${folderName}/${filename}`,
      image,
      size,
      mimetype
    );

    return filename;
  }
}
