import { ACTIONS, MODELS } from "@libs/common/constants";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ChapterRepository } from "@chapters/models/chapters/chapter.repository";
import {
  CreateChapterCommand,
  UpdateChapterCommand,
  UpdateChapterStatusCommand,
} from "./chapter.commands";
import { ChapterResponse } from "./chapter.response";
import { ChapterStatus } from "@chapters/models/chapters/chapter.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MangaEntity } from "@manga/models/mangas/manga.entity";

@Injectable()
export class ChapterCommands {
  constructor(
    private chapterRepository: ChapterRepository,
    @InjectRepository(MangaEntity)
    private mangaRepository: Repository<MangaEntity>,
    private eventEmitter: EventEmitter2
  ) {}

  async createChapter(command: CreateChapterCommand): Promise<ChapterResponse> {
    const manga = await this.mangaRepository.findOne({
      where: { id: command.mangaId },
    });
    if (!manga) {
      throw new NotFoundException("Manga not found.");
    }
    this.ensureMangaOwnership(manga, command.currentUser);

    const chapter = await this.chapterRepository.insert(
      CreateChapterCommand.fromCommand(command, command.currentUser.id)
    );
    this.emitActivity(chapter.id, ACTIONS.CREATE, command.currentUser, chapter);
    return ChapterResponse.fromEntity(chapter);
  }

  async updateChapter(command: UpdateChapterCommand): Promise<ChapterResponse> {
    const chapter = await this.chapterRepository.getById(command.id);
    if (!chapter) {
      throw new NotFoundException("Chapter not found.");
    }
    this.ensureOwnership(chapter, command.currentUser);

    if (command.title !== undefined) chapter.title = command.title;
    if (command.chapterNumber !== undefined) chapter.chapterNumber = command.chapterNumber;
    chapter.updatedBy = command.currentUser?.id;

    const updated = await this.chapterRepository.update(chapter.id, chapter);
    this.emitActivity(updated.id, ACTIONS.UPDATE, command.currentUser, updated);
    return ChapterResponse.fromEntity(updated);
  }

  async updateChapterStatus(
    command: UpdateChapterStatusCommand
  ): Promise<ChapterResponse> {
    const chapter = await this.chapterRepository.getById(command.id);
    if (!chapter) {
      throw new NotFoundException("Chapter not found.");
    }
    const oldPayload = { ...chapter };
    chapter.status = command.status;
    chapter.rejectionReason = command.rejectionReason;
    chapter.updatedBy = command.currentUser?.id;
    const updated = await this.chapterRepository.update(chapter.id, chapter);
    this.emitActivity(
      updated.id,
      command.status === ChapterStatus.Published ? ACTIONS.Approved : ACTIONS.Rejected,
      command.currentUser,
      updated,
      oldPayload
    );
    return ChapterResponse.fromEntity(updated);
  }

  async deleteChapter(id: string, currentUser?: { id?: string; permissions?: string[] }): Promise<boolean> {
    const chapter = await this.chapterRepository.getById(id, [], true);
    if (!chapter) {
      throw new NotFoundException("Chapter not found.");
    }
    this.ensureOwnership(chapter, currentUser);
    return this.chapterRepository.delete(id);
  }

  private ensureOwnership(
    chapter: { authorId: string },
    currentUser?: { id?: string; permissions?: string[] }
  ) {
    if (!currentUser?.id) throw new BadRequestException("User not authenticated.");
    const isAdmin = currentUser.permissions?.includes("manage-manga");
    if (chapter.authorId !== currentUser.id && !isAdmin) {
      throw new BadRequestException("You can only edit your own chapters.");
    }
  }

  private ensureMangaOwnership(
    manga: { authorId: string },
    currentUser?: { id?: string; permissions?: string[] }
  ) {
    if (!currentUser?.id) throw new BadRequestException("User not authenticated.");
    const isAdmin = currentUser.permissions?.includes("manage-manga");
    if (manga.authorId !== currentUser.id && !isAdmin) {
      throw new BadRequestException("You can only add chapters to your own manga.");
    }
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
      modelName: MODELS.CHAPTER,
      action,
      userId: currentUser.id,
      user: currentUser,
      payload,
      oldPayload,
    });
  }
}
