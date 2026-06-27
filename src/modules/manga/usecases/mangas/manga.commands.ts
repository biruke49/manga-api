import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { MangaEntity, MangaStatus } from "@manga/models/mangas/manga.entity";

export class CreateMangaCommand {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  artist?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  genres?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMature?: boolean;

  currentUser?: UserInfo;

  static fromCommand(command: CreateMangaCommand, authorId: string): MangaEntity {
    const manga = new MangaEntity();
    manga.title = command.title;
    manga.description = command.description;
    manga.authorId = authorId;
    manga.artist = command.artist;
    manga.genres = command.genres;
    manga.tags = command.tags;
    manga.language = command.language || "am";
    manga.isMature = command.isMature || false;
    manga.status = MangaStatus.Draft;
    manga.createdBy = command.currentUser?.id;
    return manga;
  }
}

export class UpdateMangaCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  artist?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  genres?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMature?: boolean;

  currentUser?: UserInfo;
}

export class UpdateMangaStatusCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ enum: MangaStatus })
  @IsEnum(MangaStatus)
  status: MangaStatus;

  @ApiPropertyOptional()
  @IsOptional()
  rejectionReason?: string;

  currentUser?: UserInfo;
}
