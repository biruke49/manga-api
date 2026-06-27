import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PageController } from "./controllers/page.controller";
import { ChapterPageEntity } from "./models/pages/page.entity";
import { PageRepository } from "./models/pages/page.repository";
import { PageCommands } from "./usecases/pages/page.usecase.commands";
import { PageQuery } from "./usecases/pages/page.usecase.queries";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";
import { MangaEntity } from "@manga/models/mangas/manga.entity";

@Module({
  controllers: [PageController],
  imports: [
    TypeOrmModule.forFeature([ChapterPageEntity, ChapterEntity, MangaEntity]),
  ],
  providers: [
    PageRepository,
    PageCommands,
    PageQuery,
  ],
})
export class ChapterPagesModule {}
