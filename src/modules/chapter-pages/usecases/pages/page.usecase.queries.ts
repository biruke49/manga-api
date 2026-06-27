import { FileManagerService } from "@libs/common/file-manager";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChapterPageEntity } from "@chapter-pages/models/pages/page.entity";
import { PageResponse } from "./page.response";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";

@Injectable()
export class PageQuery {
  private readonly pagesFolderName: string;

  constructor(
    @InjectRepository(ChapterPageEntity)
    private pageRepository: Repository<ChapterPageEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
    private fileManagerService: FileManagerService
  ) {
    this.pagesFolderName = process.env.MINIO_MANGA_PAGES_FOLDER || "manga-pages";
  }

  async getPages(chapterId: string): Promise<PageResponse[]> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
    });
    if (!chapter) {
      return [];
    }
    const pages = await this.pageRepository.find({
      where: { chapterId },
      order: { pageNumber: "ASC" },
    });
    const folder = this.pageFolder(chapter.mangaId, chapterId);
    return Promise.all(
      pages.map((entity) => this.toResponse(entity, folder))
    );
  }

  async getPublicPages(chapterId: string): Promise<PageResponse[]> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
    });
    if (!chapter) {
      return [];
    }
    const pages = await this.pageRepository.find({
      where: { chapterId },
      order: { pageNumber: "ASC" },
    });
    const folder = this.pageFolder(chapter.mangaId, chapterId);
    return Promise.all(
      pages.map((entity) => this.toResponse(entity, folder))
    );
  }

  private async toResponse(entity: ChapterPageEntity, folder: string): Promise<PageResponse> {
    const response = PageResponse.fromEntity(entity);
    response.imageUrl = await this.fileManagerService
      .getFromMinio(folder, response.imageFilename)
      .catch(() => null);
    return response;
  }

  private pageFolder(mangaId: string, chapterId: string): string {
    return `${this.pagesFolderName}/${mangaId}/${chapterId}`;
  }
}
