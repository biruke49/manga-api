import { ApiProperty } from "@nestjs/swagger";
import { CommentEntity } from "@comments/models/comments/comment.entity";

export class CommentResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  mangaId: string;

  @ApiProperty()
  chapterId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  parentId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: CommentEntity): CommentResponse {
    const response = new CommentResponse();
    response.id = entity.id;
    response.userId = entity.userId;
    response.mangaId = entity.mangaId;
    response.chapterId = entity.chapterId;
    response.content = entity.content;
    response.parentId = entity.parentId;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
