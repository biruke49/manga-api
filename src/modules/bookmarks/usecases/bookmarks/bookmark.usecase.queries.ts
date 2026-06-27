import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookmarkEntity } from "@bookmarks/models/bookmarks/bookmark.entity";
import { BookmarkResponse } from "./bookmark.response";

@Injectable()
export class BookmarkQuery {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>
  ) {}

  async getMyBookmarks(userId: string): Promise<BookmarkResponse[]> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return bookmarks.map((entity) => BookmarkResponse.fromEntity(entity));
  }
}
