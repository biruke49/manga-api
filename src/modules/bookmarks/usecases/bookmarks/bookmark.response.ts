import { ApiProperty } from "@nestjs/swagger";
import { BookmarkEntity } from "@bookmarks/models/bookmarks/bookmark.entity";

export class BookmarkResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  mangaId: string;

  @ApiProperty()
  lastChapterId: string;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: BookmarkEntity): BookmarkResponse {
    const response = new BookmarkResponse();
    response.id = entity.id;
    response.userId = entity.userId;
    response.mangaId = entity.mangaId;
    response.lastChapterId = entity.lastChapterId;
    response.createdAt = entity.createdAt;
    return response;
  }
}
