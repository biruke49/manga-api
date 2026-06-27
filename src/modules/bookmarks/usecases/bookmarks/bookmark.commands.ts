import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class AddBookmarkCommand {
  @ApiProperty()
  @IsNotEmpty()
  mangaId: string;

  @ApiPropertyOptional()
  @IsOptional()
  lastChapterId?: string;

  currentUser?: UserInfo;
}
