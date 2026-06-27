import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookmarkEntity } from "./bookmark.entity";

@Injectable()
export class BookmarkRepository extends BaseRepository<BookmarkEntity> {
  constructor(
    @InjectRepository(BookmarkEntity)
    bookmarkRepository: Repository<BookmarkEntity>
  ) {
    super(bookmarkRepository);
  }
}
