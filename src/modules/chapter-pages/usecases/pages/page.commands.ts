import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ReorderPageItem {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  pageNumber: number;
}

export class ReorderPagesCommand {
  @ApiProperty()
  @IsNotEmpty()
  chapterId: string;

  @ApiProperty({ type: [ReorderPageItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderPageItem)
  pages: ReorderPageItem[];

  currentUser?: UserInfo;
}
