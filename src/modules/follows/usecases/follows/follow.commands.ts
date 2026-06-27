import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class FollowCreatorCommand {
  @ApiProperty()
  @IsNotEmpty()
  creatorId: string;

  currentUser?: UserInfo;
}
