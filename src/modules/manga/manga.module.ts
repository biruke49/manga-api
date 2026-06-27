import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MangaController } from "./controllers/manga.controller";
import { MangaEntity } from "./models/mangas/manga.entity";
import { MangaRepository } from "./models/mangas/manga.repository";
import { MangaCommands } from "./usecases/mangas/manga.usecase.commands";
import { MangaQuery } from "./usecases/mangas/manga.usecase.queries";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";

@Module({
  controllers: [MangaController],
  imports: [
    TypeOrmModule.forFeature([MangaEntity, ChapterEntity]),
  ],
  providers: [
    MangaRepository,
    MangaCommands,
    MangaQuery,
  ],
})
export class MangaModule {}
