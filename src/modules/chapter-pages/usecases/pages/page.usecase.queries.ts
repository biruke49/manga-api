import { FileManagerService } from "@libs/common/file-manager";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChapterPageEntity } from "@chapter-pages/models/pages/page.entity";
import { PageResponse } from "./page.response";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";

@Injectable()
export class PageQuery {
  constructor(
    @InjectRepository(ChapterPageEntity)
    private pageRepository: Repository<ChapterPageEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
    private fileManagerService: FileManagerService
  ) {}

  async getPages(chapterId: string): Promise<PageResponse[]> {
    const pages = await this.pageRepository.find({
      where: { chapterId },
      order: { pageNumber: "ASC" },
    });
    return Promise.all(
      pages.map((entity) => this.toResponse(entity))
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
    return Promise.all(
      pages.map((entity) => this.toResponse(entity))
    );
  }

  private async toResponse(entity: ChapterPageEntity): Promise<PageResponse> {
    const response = PageResponse.fromEntity(entity);
    response.imageUrl = await this.fileManagerService
      .getFromMinio(this.pageFolder(entity), response.imageFilename)
      .catch(() => null);
    return response;
  }

  private pageFolder(entity: ChapterPageEntity): string {
    return `manga-pages/_/${entity.chapterId}`;
  }
}
