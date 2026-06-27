import { ApiProperty } from "@nestjs/swagger";
import { MangaEntity, MangaStatus } from "@manga/models/mangas/manga.entity";

export class MangaResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  coverImageFilename: string;

  @ApiProperty()
  pdfFilename: string;

  @ApiProperty()
  coverImageUrl: string;

  @ApiProperty({ enum: MangaStatus })
  status: MangaStatus;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  artist: string;

  @ApiProperty()
  genres: string[];

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  language: string;

  @ApiProperty()
  isMature: boolean;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  chapterCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: MangaEntity): MangaResponse {
    const response = new MangaResponse();
    response.id = entity.id;
    response.title = entity.title;
    response.description = entity.description;
    response.coverImageFilename = entity.coverImageFilename;
    response.pdfFilename = entity.pdfFilename;
    response.status = entity.status;
    response.authorId = entity.authorId;
    response.artist = entity.artist;
    response.genres = entity.genres || [];
    response.tags = entity.tags || [];
    response.language = entity.language;
    response.isMature = entity.isMature;
    response.rejectionReason = entity.rejectionReason;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
