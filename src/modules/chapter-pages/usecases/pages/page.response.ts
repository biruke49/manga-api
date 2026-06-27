import { ApiProperty } from "@nestjs/swagger";
import { ChapterPageEntity } from "@chapter-pages/models/pages/page.entity";

export class PageResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  chapterId: string;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  imageFilename: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: ChapterPageEntity): PageResponse {
    const response = new PageResponse();
    response.id = entity.id;
    response.chapterId = entity.chapterId;
    response.pageNumber = entity.pageNumber;
    response.imageFilename = entity.imageFilename;
    response.width = entity.width;
    response.height = entity.height;
    response.createdAt = entity.createdAt;
    return response;
  }
}
