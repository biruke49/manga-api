import { ApiProperty } from "@nestjs/swagger";
import { ReportEntity, ReportStatus } from "@reports/models/reports/report.entity";

export class ReportResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reporterId: string;

  @ApiProperty()
  mangaId: string;

  @ApiProperty()
  chapterId: string;

  @ApiProperty()
  commentId: string;

  @ApiProperty()
  reason: string;

  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty()
  adminNote: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(entity: ReportEntity): ReportResponse {
    const response = new ReportResponse();
    response.id = entity.id;
    response.reporterId = entity.reporterId;
    response.mangaId = entity.mangaId;
    response.chapterId = entity.chapterId;
    response.commentId = entity.commentId;
    response.reason = entity.reason;
    response.status = entity.status;
    response.adminNote = entity.adminNote;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    return response;
  }
}
