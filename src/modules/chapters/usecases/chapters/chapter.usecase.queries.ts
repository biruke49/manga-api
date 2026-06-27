import { CollectionQuery } from "@libs/collection-query/collection-query";
import { QueryConstructor } from "@libs/collection-query/query-constructor";
import { DataResponseFormat } from "@libs/response-format/data-response-format";
import { FileManagerService } from "@libs/common/file-manager";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ChapterEntity,
  ChapterStatus,
} from "@chapters/models/chapters/chapter.entity";
import { ChapterResponse } from "./chapter.response";
import { ReaderResponse } from "./reader.response";
import {
  ChapterPageEntity,
} from "@chapter-pages/models/pages/page.entity";
import { PageResponse } from "@chapter-pages/usecases/pages/page.response";

@Injectable()
export class ChapterQuery {
  private readonly pagesFolderName: string;

  constructor(
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
    @InjectRepository(ChapterPageEntity)
    private pageRepository: Repository<ChapterPageEntity>,
    private fileManagerService: FileManagerService
  ) {
    this.pagesFolderName = process.env.MINIO_MANGA_PAGES_FOLDER || "manga-pages";
  }

  async getChapter(id: string): Promise<ChapterResponse> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
    });
    if (!chapter) {
      throw new NotFoundException("Chapter not found.");
    }
    return ChapterResponse.fromEntity(chapter);
  }

  async getChapters(
    query: CollectionQuery
  ): Promise<DataResponseFormat<ChapterResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ChapterEntity>(
      this.chapterRepository,
      query
    );
    const response = new DataResponseFormat<ChapterResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = result.map((entity) => ChapterResponse.fromEntity(entity));
    response.count = total;
    return response;
  }

  async getPublicChapters(
    mangaId: string
  ): Promise<ChapterResponse[]> {
    const chapters = await this.chapterRepository.find({
      where: { mangaId, status: ChapterStatus.Published },
      order: { chapterNumber: "ASC" },
    });
    return chapters.map((entity) => ChapterResponse.fromEntity(entity));
  }

  async getReaderChapter(
    chapterId: string
  ): Promise<ReaderResponse> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId, status: ChapterStatus.Published },
    });
    if (!chapter) {
      throw new NotFoundException("Chapter not found or not published.");
    }
    const pages = await this.pageRepository.find({
      where: { chapterId },
      order: { pageNumber: "ASC" },
    });
    const pageResponses = await Promise.all(
      pages.map((p) => this.toPageResponse(p, chapter.mangaId))
    );
    return ReaderResponse.fromEntity(chapter, pageResponses);
  }

  private async toPageResponse(
    entity: ChapterPageEntity,
    mangaId: string
  ): Promise<PageResponse> {
    const response = PageResponse.fromEntity(entity);
    response.imageUrl = await this.fileManagerService
      .getFromMinio(`${this.pagesFolderName}/${mangaId}/${entity.chapterId}`, entity.imageFilename)
      .catch(() => null);
    return response;
  }

  async getMyChapters(
    authorId: string,
    query: CollectionQuery
  ): Promise<DataResponseFormat<ChapterResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ChapterEntity>(
      this.chapterRepository,
      query
    );
    dataQuery.andWhere('"author_id" = :authorId', { authorId });
    const response = new DataResponseFormat<ChapterResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = result.map((entity) => ChapterResponse.fromEntity(entity));
    response.count = total;
    return response;
  }

  async getChaptersByManga(
    mangaId: string,
    query: CollectionQuery
  ): Promise<DataResponseFormat<ChapterResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ChapterEntity>(
      this.chapterRepository,
      query
    );
    dataQuery.andWhere('"manga_id" = :mangaId', { mangaId });
    const response = new DataResponseFormat<ChapterResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = result.map((entity) => ChapterResponse.fromEntity(entity));
    response.count = total;
    return response;
  }

  async getPendingChapters(
    query: CollectionQuery
  ): Promise<DataResponseFormat<ChapterResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ChapterEntity>(
      this.chapterRepository,
      query
    );
    dataQuery.andWhere('"status" = :status', { status: ChapterStatus.Pending });
    const response = new DataResponseFormat<ChapterResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = result.map((entity) => ChapterResponse.fromEntity(entity));
    response.count = total;
    return response;
  }
}
