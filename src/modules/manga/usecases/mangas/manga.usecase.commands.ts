import { ACTIONS, MODELS } from "@libs/common/constants";
import { FileManagerService } from "@libs/common/file-manager";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MangaRepository } from "@manga/models/mangas/manga.repository";
import {
  CreateMangaCommand,
  UpdateMangaCommand,
  UpdateMangaStatusCommand,
} from "./manga.commands";
import { MangaResponse } from "./manga.response";
import { MangaStatus } from "@manga/models/mangas/manga.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MangaCommands {
  private readonly minioBucketName: string;
  private readonly coverFolderName: string;
  private readonly pdfFolderName: string;

  constructor(
    private mangaRepository: MangaRepository,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService
  ) {
    this.minioBucketName = process.env.MINIO_BUCKET_NAME;
    this.coverFolderName = process.env.MINIO_MANGA_COVERS_FOLDER || "manga-covers";
    this.pdfFolderName = process.env.MINIO_MANGA_PDFS_FOLDER || "manga-pdfs";
  }

  async createManga(command: CreateMangaCommand): Promise<MangaResponse> {
    const manga = await this.mangaRepository.insert(
      CreateMangaCommand.fromCommand(command, command.currentUser.id)
    );
    this.emitActivity(manga.id, ACTIONS.CREATE, command.currentUser, manga);
    return MangaResponse.fromEntity(manga);
  }

  async updateManga(command: UpdateMangaCommand): Promise<MangaResponse> {
    const manga = await this.mangaRepository.getById(command.id);
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    this.ensureOwnership(manga, command.currentUser);

    if (command.title !== undefined) manga.title = command.title;
    if (command.description !== undefined) manga.description = command.description;
    if (command.artist !== undefined) manga.artist = command.artist;
    if (command.genres !== undefined) manga.genres = command.genres;
    if (command.tags !== undefined) manga.tags = command.tags;
    if (command.language !== undefined) manga.language = command.language;
    if (command.isMature !== undefined) manga.isMature = command.isMature;
    manga.updatedBy = command.currentUser?.id;

    const updated = await this.mangaRepository.update(manga.id, manga);
    this.emitActivity(updated.id, ACTIONS.UPDATE, command.currentUser, updated);
    return MangaResponse.fromEntity(updated);
  }

  async updateMangaStatus(
    command: UpdateMangaStatusCommand
  ): Promise<MangaResponse> {
    const manga = await this.mangaRepository.getById(command.id);
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    const oldPayload = { ...manga };
    manga.status = command.status;
    manga.rejectionReason = command.rejectionReason;
    manga.updatedBy = command.currentUser?.id;
    const updated = await this.mangaRepository.update(manga.id, manga);
    this.emitActivity(
      updated.id,
      command.status === MangaStatus.Published ? ACTIONS.Approved : ACTIONS.Rejected,
      command.currentUser,
      updated,
      oldPayload
    );
    return MangaResponse.fromEntity(updated);
  }

  async updateMangaCover(
    id: string,
    file: Express.Multer.File,
    currentUser?: { id?: string }
  ): Promise<MangaResponse> {
    if (!file) {
      throw new BadRequestException("Cover image is required.");
    }
    if (!file.mimetype?.startsWith("image/")) {
      throw new BadRequestException("Cover must be an image file.");
    }

    const manga = await this.mangaRepository.getById(id);
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    this.ensureOwnership(manga, currentUser);

    if (manga.coverImageFilename) {
      await this.fileManagerService.removeFromMinio(
        this.minioBucketName,
        `${this.coverFolder(id)}/${manga.coverImageFilename}`
      );
    }

    const filename = `${uuidv4()}`;
    await this.fileManagerService.uploadFileToMinio(
      this.minioBucketName,
      `${this.coverFolder(id)}/${filename}`,
      file.buffer,
      file.size,
      file.mimetype
    );

    manga.coverImageFilename = filename;
    manga.updatedBy = currentUser?.id;
    const updated = await this.mangaRepository.update(manga.id, manga);
    this.emitActivity(updated.id, ACTIONS.UPDATE, currentUser, updated);
    return MangaResponse.fromEntity(updated);
  }

  async updateMangaPdf(
    id: string,
    file: Express.Multer.File,
    currentUser?: { id?: string }
  ): Promise<MangaResponse> {
    if (!file) {
      throw new BadRequestException("PDF file is required.");
    }
    if (file.mimetype !== "application/pdf") {
      throw new BadRequestException("Manga PDF must be a PDF file.");
    }

    const manga = await this.mangaRepository.getById(id);
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    this.ensureOwnership(manga, currentUser);

    if (manga.pdfFilename) {
      await this.fileManagerService.removeFromMinio(
        this.minioBucketName,
        `${this.pdfFolder(id)}/${manga.pdfFilename}`
      );
    }

    const filename = `${uuidv4()}.pdf`;
    await this.fileManagerService.uploadFileToMinio(
      this.minioBucketName,
      `${this.pdfFolder(id)}/${filename}`,
      file.buffer,
      file.size,
      file.mimetype
    );

    manga.pdfFilename = filename;
    manga.updatedBy = currentUser?.id;
    const updated = await this.mangaRepository.update(manga.id, manga);
    this.emitActivity(updated.id, ACTIONS.UPDATE, currentUser, updated);
    return MangaResponse.fromEntity(updated);
  }

  async deleteManga(id: string, currentUser?: { id?: string; permissions?: string[] }): Promise<boolean> {
    const manga = await this.mangaRepository.getById(id, [], true);
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    this.ensureOwnership(manga, currentUser);
    return this.mangaRepository.delete(id);
  }

  private ensureOwnership(
    manga: { authorId: string },
    currentUser?: { id?: string; permissions?: string[] }
  ) {
    if (!currentUser?.id) {
      throw new BadRequestException("User not authenticated.");
    }
    const isAdmin = currentUser.permissions?.includes("manage-manga");
    if (manga.authorId !== currentUser.id && !isAdmin) {
      throw new BadRequestException("You can only edit your own manga.");
    }
  }

  private coverFolder(mangaId: string): string {
    return `${this.coverFolderName}/${mangaId}`;
  }

  private pdfFolder(mangaId: string): string {
    return `${this.pdfFolderName}/${mangaId}`;
  }

  private emitActivity(
    modelId: string,
    action: ACTIONS,
    currentUser?: { id?: string },
    payload?: unknown,
    oldPayload?: unknown
  ) {
    if (!currentUser?.id) return;
    this.eventEmitter.emit("activity-logger.store", {
      modelId,
      modelName: MODELS.MANGA,
      action,
      userId: currentUser.id,
      user: currentUser,
      payload,
      oldPayload,
    });
  }
}
