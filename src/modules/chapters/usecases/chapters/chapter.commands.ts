import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { ChapterEntity, ChapterStatus } from "@chapters/models/chapters/chapter.entity";

export class CreateChapterCommand {
  @ApiProperty()
  @IsNotEmpty()
  mangaId: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  chapterNumber: number;

  currentUser?: UserInfo;

  static fromCommand(command: CreateChapterCommand, authorId: string): ChapterEntity {
    const chapter = new ChapterEntity();
    chapter.mangaId = command.mangaId;
    chapter.title = command.title;
    chapter.chapterNumber = command.chapterNumber;
    chapter.authorId = authorId;
    chapter.status = ChapterStatus.Draft;
    chapter.pageCount = 0;
    chapter.createdBy = command.currentUser?.id;
    return chapter;
  }
}

export class UpdateChapterCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  chapterNumber?: number;

  currentUser?: UserInfo;
}

export class UpdateChapterStatusCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ enum: ChapterStatus })
  @IsEnum(ChapterStatus)
  status: ChapterStatus;

  @ApiPropertyOptional()
  @IsOptional()
  rejectionReason?: string;

  currentUser?: UserInfo;
}
