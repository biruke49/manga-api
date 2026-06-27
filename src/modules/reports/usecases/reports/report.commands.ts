import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ReportStatus } from "@reports/models/reports/report.entity";

export class CreateReportCommand {
  @ApiPropertyOptional()
  @IsOptional()
  mangaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  chapterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  commentId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;

  currentUser?: UserInfo;
}

export class UpdateReportStatusCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ enum: ReportStatus })
  @IsNotEmpty()
  status: ReportStatus;

  @ApiPropertyOptional()
  @IsOptional()
  adminNote?: string;

  currentUser?: UserInfo;
}
