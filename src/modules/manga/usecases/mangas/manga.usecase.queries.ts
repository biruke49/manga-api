import { CollectionQuery } from "@libs/collection-query/collection-query";
import { QueryConstructor } from "@libs/collection-query/query-constructor";
import { DataResponseFormat } from "@libs/response-format/data-response-format";
import { FileManagerService } from "@libs/common/file-manager";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MangaEntity, MangaStatus } from "@manga/models/mangas/manga.entity";
import { MangaResponse } from "./manga.response";
import { MangaDetailResponse } from "./manga-detail.response";
import {
  ChapterEntity,
  ChapterStatus,
} from "@chapters/models/chapters/chapter.entity";
import { ChapterResponse } from "@chapters/usecases/chapters/chapter.response";

@Injectable()
export class MangaQuery {
  private readonly coverFolderName: string;

  constructor(
    @InjectRepository(MangaEntity)
    private mangaRepository: Repository<MangaEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
    private fileManagerService: FileManagerService
  ) {
    this.coverFolderName = process.env.MINIO_MANGA_COVERS_FOLDER || "manga-covers";
  }

  async getManga(id: string): Promise<MangaResponse> {
    const manga = await this.mangaRepository.findOne({ where: { id } });
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    return this.toResponse(manga);
  }

  async getMangas(
    query: CollectionQuery
  ): Promise<DataResponseFormat<MangaResponse>> {
    const dataQuery = QueryConstructor.constructQuery<MangaEntity>(
      this.mangaRepository,
      query
    );
    const response = new DataResponseFormat<MangaResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = await Promise.all(
      result.map((entity) => this.toResponse(entity))
    );
    response.count = total;
    return response;
  }

  async getPublicMangas(
    query: CollectionQuery
  ): Promise<DataResponseFormat<MangaResponse>> {
    const dataQuery = QueryConstructor.constructQuery<MangaEntity>(
      this.mangaRepository,
      query
    );
    dataQuery.andWhere('"status" = :status', {
      status: MangaStatus.Published,
    });
    const response = new DataResponseFormat<MangaResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = await Promise.all(
      result.map((entity) => this.toResponse(entity))
    );
    response.count = total;
    return response;
  }

  async getPublicManga(id: string): Promise<MangaResponse> {
    const manga = await this.mangaRepository.findOne({
      where: { id, status: MangaStatus.Published },
    });
    if (!manga) {
      throw new NotFoundException("Manga not found or not published.");
    }
    return this.toResponse(manga);
  }

  async getPublicMangaDetail(id: string): Promise<MangaDetailResponse> {
    const manga = await this.mangaRepository.findOne({
      where: { id, status: MangaStatus.Published },
    });
    if (!manga) {
      throw new NotFoundException("Manga not found or not published.");
    }
    const chapters = await this.chapterRepository.find({
      where: { mangaId: id, status: ChapterStatus.Published },
      order: { chapterNumber: "ASC" },
    });
    const response = MangaDetailResponse.fromEntity(
      manga,
      chapters.map((c) => ChapterResponse.fromEntity(c))
    );
    if (manga.coverImageFilename) {
      response.coverImageUrl = await this.fileManagerService
        .getFromMinio(this.coverFolder(manga.id), manga.coverImageFilename)
        .catch(() => null);
    }
    return response;
  }

  async getMyMangas(
    authorId: string,
    query: CollectionQuery
  ): Promise<DataResponseFormat<MangaResponse>> {
    const dataQuery = QueryConstructor.constructQuery<MangaEntity>(
      this.mangaRepository,
      query
    );
    dataQuery.andWhere('"author_id" = :authorId', { authorId });
    const response = new DataResponseFormat<MangaResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = await Promise.all(
      result.map((entity) => this.toResponse(entity))
    );
    response.count = total;
    return response;
  }

  async getPendingMangas(
    query: CollectionQuery
  ): Promise<DataResponseFormat<MangaResponse>> {
    const dataQuery = QueryConstructor.constructQuery<MangaEntity>(
      this.mangaRepository,
      query
    );
    dataQuery.andWhere('"status" = :status', { status: MangaStatus.Pending });
    const response = new DataResponseFormat<MangaResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = await Promise.all(
      result.map((entity) => this.toResponse(entity))
    );
    response.count = total;
    return response;
  }

  private async toResponse(entity: MangaEntity): Promise<MangaResponse> {
    const response = MangaResponse.fromEntity(entity);
    response.chapterCount = await this.chapterRepository.count({
      where: { mangaId: entity.id },
    });
    if (response.coverImageFilename) {
      response.coverImageUrl = await this.fileManagerService
        .getFromMinio(this.coverFolder(entity.id), response.coverImageFilename)
        .catch(() => null);
    }
    return response;
  }

  private coverFolder(mangaId: string): string {
    return `${this.coverFolderName}/${mangaId}`;
  }
}
