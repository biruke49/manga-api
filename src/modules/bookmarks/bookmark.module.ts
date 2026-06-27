import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookmarkController } from "./controllers/bookmark.controller";
import { BookmarkEntity } from "./models/bookmarks/bookmark.entity";
import { BookmarkRepository } from "./models/bookmarks/bookmark.repository";
import { BookmarkCommands } from "./usecases/bookmarks/bookmark.usecase.commands";
import { BookmarkQuery } from "./usecases/bookmarks/bookmark.usecase.queries";

@Module({
  controllers: [BookmarkController],
  imports: [TypeOrmModule.forFeature([BookmarkEntity])],
  providers: [BookmarkRepository, BookmarkCommands, BookmarkQuery],
})
export class BookmarkModule {}
