import { ACTIONS, MODELS } from "@libs/common/constants";
import { FileManagerService } from "@libs/common/file-manager";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChapterPageEntity } from "@chapter-pages/models/pages/page.entity";
import { PageRepository } from "@chapter-pages/models/pages/page.repository";
import { ReorderPagesCommand } from "./page.commands";
import { PageResponse } from "./page.response";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";
import { MangaEntity } from "@manga/models/mangas/manga.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class PageCommands {
  private readonly minioBucketName: string;

  constructor(
    private pageRepository: PageRepository,
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
    @InjectRepository(MangaEntity)
    private mangaRepository: Repository<MangaEntity>,
    private eventEmitter: EventEmitter2,
    private readonly fileManagerService: FileManagerService
  ) {
    this.minioBucketName = process.env.MINIO_BUCKET_NAME;
  }

  async uploadPages(
    chapterId: string,
    files: Express.Multer.File[],
    currentUser?: { id?: string; permissions?: string[] }
  ): Promise<PageResponse[]> {
    if (!files?.length) {
      throw new BadRequestException("At least one page image is required.");
    }
    if (files.some((file) => !file.mimetype?.startsWith("image/"))) {
      throw new BadRequestException("All pages must be image files.");
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
    });
    if (!chapter) {
      throw new NotFoundException("Chapter not found.");
    }
    this.ensureOwnership(chapter, currentUser);

    const manga = await this.mangaRepository.findOne({
      where: { id: chapter.mangaId },
    });
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }

    const existingPages = await this.pageRepository.getAllBy(
      "chapterId",
      chapterId
    );
    const nextPageNumber =
      existingPages.length > 0
        ? Math.max(...existingPages.map((p) => p.pageNumber)) + 1
        : 1;

    const pageFolder = this.pageFolder(manga.id, chapterId);
    const pages: ChapterPageEntity[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = `${uuidv4()}`;

      await this.fileManagerService.uploadFileToMinio(
        this.minioBucketName,
        `${pageFolder}/${filename}`,
        file.buffer,
        file.size,
        file.mimetype
      );

      const page = new ChapterPageEntity();
      page.chapterId = chapterId;
      page.pageNumber = nextPageNumber + i;
      page.imageFilename = filename;
      page.createdBy = currentUser?.id;
      pages.push(page);
    }

    const savedPages = await Promise.all(
      pages.map((page) => this.pageRepository.insert(page))
    );

    chapter.pageCount = (existingPages.length + files.length);
    chapter.updatedBy = currentUser?.id;
    await this.chapterRepository.update(chapter.id, chapter);

    this.emitActivity(chapterId, ACTIONS.CREATE, currentUser, savedPages);
    return savedPages.map((entity) => PageResponse.fromEntity(entity));
  }

  async reorderPages(
    command: ReorderPagesCommand
  ): Promise<PageResponse[]> {
    const chapter = await this.chapterRepository.findOne({
      where: { id: command.chapterId },
    });
    if (!chapter) {
      throw new NotFoundException("Chapter not found.");
    }

    const updatedPages: ChapterPageEntity[] = [];
    for (const item of command.pages) {
      const page = await this.pageRepository.getById(item.id);
      if (!page) {
        throw new NotFoundException(`Page ${item.id} not found.`);
      }
      page.pageNumber = item.pageNumber;
      page.updatedBy = command.currentUser?.id;
      const updated = await this.pageRepository.update(page.id, page);
      updatedPages.push(updated);
    }

    updatedPages.sort((a, b) => a.pageNumber - b.pageNumber);
    return updatedPages.map((entity) => PageResponse.fromEntity(entity));
  }

  async deletePage(
    id: string,
    currentUser?: { id?: string; permissions?: string[] }
  ): Promise<boolean> {
    const page = await this.pageRepository.getById(id, [], true);
    if (!page) {
      throw new NotFoundException("Page not found.");
    }

    const chapter = await this.chapterRepository.findOne({
      where: { id: page.chapterId },
    });
    if (chapter) {
      this.ensureOwnership(chapter, currentUser);
    }

    await this.fileManagerService.removeFromMinio(
      this.minioBucketName,
      `${this.pageFolderFromChapter(page.chapterId)}/${page.imageFilename}`
    );

    const result = await this.pageRepository.delete(id);

    if (chapter) {
      const remainingPages = await this.pageRepository.getAllBy(
        "chapterId",
        page.chapterId
      );
      chapter.pageCount = remainingPages.length;
      await this.chapterRepository.update(chapter.id, chapter);
    }

    return result;
  }

  private ensureOwnership(
    chapter: { authorId: string },
    currentUser?: { id?: string; permissions?: string[] }
  ) {
    if (!currentUser?.id) throw new BadRequestException("User not authenticated.");
    const isAdmin = currentUser.permissions?.includes("manage-manga");
    if (chapter.authorId !== currentUser.id && !isAdmin) {
      throw new BadRequestException("You can only manage pages for your own chapters.");
    }
  }

  private pageFolder(mangaId: string, chapterId: string): string {
    return `manga-pages/${mangaId}/${chapterId}`;
  }

  private pageFolderFromChapter(chapterId: string): string {
    return `manga-pages/_/${chapterId}`;
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
      modelName: MODELS.CHAPTER_PAGE,
      action,
      userId: currentUser.id,
      user: currentUser,
      payload,
      oldPayload,
    });
  }
}
