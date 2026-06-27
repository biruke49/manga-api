import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentCommand {
  @ApiProperty()
  @IsNotEmpty()
  mangaId: string;

  @ApiPropertyOptional()
  @IsOptional()
  chapterId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  parentId?: string;

  currentUser?: UserInfo;
}

export class UpdateCommentCommand {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  currentUser?: UserInfo;
}
