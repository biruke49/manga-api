import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FollowCreatorCommand } from "@follows/usecases/follows/follow.commands";
import { FollowResponse } from "@follows/usecases/follows/follow.response";
import { FollowCommands } from "@follows/usecases/follows/follow.usecase.commands";
import { FollowQuery } from "@follows/usecases/follows/follow.usecase.queries";

@Controller("follows")
@ApiTags("follows")
export class FollowController {
  constructor(
    private followCommands: FollowCommands,
    private followQuery: FollowQuery
  ) {}

  @Post("follow-creator")
  @ApiOkResponse({ type: FollowResponse })
  async followCreator(
    @CurrentUser() user: UserInfo,
    @Body() command: FollowCreatorCommand
  ) {
    command.currentUser = user;
    return this.followCommands.followCreator(command);
  }

  @Delete("unfollow-creator/:id")
  @ApiOkResponse({ type: Boolean })
  async unfollowCreator(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.followCommands.unfollowCreator(id, user);
  }

  @Get("my-follows")
  @ApiOkResponse({ type: FollowResponse, isArray: true })
  async getMyFollows(@CurrentUser() user: UserInfo) {
    return this.followQuery.getMyFollows(user.id);
  }

  @Get("creator-followers/:creatorId")
  @ApiOkResponse({ type: FollowResponse, isArray: true })
  async getCreatorFollowers(@Param("creatorId") creatorId: string) {
    return this.followQuery.getCreatorFollowers(creatorId);
  }

  @Get("creator-followers-count/:creatorId")
  @ApiOkResponse({ type: Number })
  async getCreatorFollowersCount(@Param("creatorId") creatorId: string) {
    return this.followQuery.getCreatorFollowersCount(creatorId);
  }
}
