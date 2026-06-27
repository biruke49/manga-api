import { ApiProperty } from "@nestjs/swagger";

export class AdminStatsResponse {
  @ApiProperty()
  totalMangas: number;

  @ApiProperty()
  publishedMangas: number;

  @ApiProperty()
  pendingMangas: number;

  @ApiProperty()
  draftMangas: number;

  @ApiProperty()
  rejectedMangas: number;

  @ApiProperty()
  totalChapters: number;

  @ApiProperty()
  publishedChapters: number;

  @ApiProperty()
  pendingChapters: number;

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalReaders: number;

  @ApiProperty()
  totalCreators: number;

  @ApiProperty()
  totalAdmins: number;

  @ApiProperty()
  pendingReports: number;
}

export class CreatorStatsResponse {
  @ApiProperty()
  totalMangas: number;

  @ApiProperty()
  publishedMangas: number;

  @ApiProperty()
  pendingMangas: number;

  @ApiProperty()
  draftMangas: number;

  @ApiProperty()
  totalChapters: number;

  @ApiProperty()
  publishedChapters: number;

  @ApiProperty()
  followerCount: number;
}
