import { ApiProperty } from "@nestjs/swagger";
import { ChapterEntity, ChapterStatus } from "@chapters/models/chapters/chapter.entity";

export class ChapterResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mangaId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  chapterNumber: number;

  @ApiProperty({ enum: ChapterStatus })
  status: ChapterStatus;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: ChapterEntity): ChapterResponse {
    const response = new ChapterResponse();
    response.id = entity.id;
    response.mangaId = entity.mangaId;
    response.title = entity.title;
    response.chapterNumber = Number(entity.chapterNumber);
    response.status = entity.status;
    response.pageCount = entity.pageCount;
    response.authorId = entity.authorId;
    response.rejectionReason = entity.rejectionReason;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
