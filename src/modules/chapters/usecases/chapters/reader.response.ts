import { ApiProperty } from "@nestjs/swagger";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";
import { ChapterResponse } from "./chapter.response";
import { PageResponse } from "@chapter-pages/usecases/pages/page.response";

export class ReaderResponse {
  @ApiProperty({ type: ChapterResponse })
  chapter: ChapterResponse;

  @ApiProperty({ type: PageResponse, isArray: true })
  pages: PageResponse[];

  static fromEntity(
    entity: ChapterEntity,
    pages: PageResponse[]
  ): ReaderResponse {
    const response = new ReaderResponse();
    response.chapter = ChapterResponse.fromEntity(entity);
    response.pages = pages;
    return response;
  }
}
