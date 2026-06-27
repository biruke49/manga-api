import { FileManagerHelper } from "@libs/common/file-manager/utils/file-manager-helper";
import { FileResponseDto } from "@libs/common/file-manager/dtos/file-response.dto";
import { FileManagerService } from "@libs/common/file-manager";
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { AllowAnonymous } from "@account/auth/decorators/allow-anonymous.decorator";
import { validate } from "class-validator";
import { AppService } from "app.service";
@ApiTags("/")
@Controller("/")
export class AppController {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private appService: AppService
  ) {}
  @Get("status")
  @AllowAnonymous()
  async getMinioStatus(): Promise<{ serverUp: any }> {
    // const serverUp = await this.fileManagerService.isMinioServerUp();
    const serverUp = await this.fileManagerService.getFromMinio(
      "asdfg",
      "asdfg"
    );
    return { serverUp };
  }
  @Get("get-date")
  @AllowAnonymous()
  async getDate(): Promise<any> {
    const date = new Date();
    return date;
  }
  @Get("download-file")
  @AllowAnonymous()
  async downloadFile(
    @Query() file: FileResponseDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<StreamableFile> {
    validate(file).then((errors) => {
      if (errors.length > 0) {
        throw new BadRequestException(`Bad request`);
      }
    });
    const stream = await this.fileManagerService.downloadFile(
      file,
      FileManagerHelper.UPLOADED_FILES_DESTINATION,
      response
    );

    response.set({
      "Content-Disposition": `inline; filename="${file.originalname}"`,
      "Content-Type": file.mimetype,
    });

    return stream;
  }
  @Get("get-day-of-week")
  @AllowAnonymous()
  async getDayOdWeek() {
    const routes = this.appService.getDayOfWeek();
    return routes;
  }
  @Get("get-distance")
  @AllowAnonymous()
  async getDistance() {
    const origin = `37.7749,-122.4194`;
    const destination = `34.0522,-118.2437`;

    const routes = this.appService.getDistance(origin, destination);
    return routes;
  }
}
