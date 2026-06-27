import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChapterController } from "./controllers/chapter.controller";
import { ChapterEntity } from "./models/chapters/chapter.entity";
import { ChapterRepository } from "./models/chapters/chapter.repository";
import { ChapterCommands } from "./usecases/chapters/chapter.usecase.commands";
import { ChapterQuery } from "./usecases/chapters/chapter.usecase.queries";
import { MangaEntity } from "@manga/models/mangas/manga.entity";
import { ChapterPageEntity } from "@chapter-pages/models/pages/page.entity";
import { FileManagerService } from "@libs/common/file-manager";

@Module({
  controllers: [ChapterController],
  imports: [
    TypeOrmModule.forFeature([ChapterEntity, MangaEntity, ChapterPageEntity]),
  ],
  providers: [
    ChapterRepository,
    ChapterCommands,
    ChapterQuery,
    FileManagerService,
  ],
})
export class ChapterModule {}
