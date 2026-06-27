import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  CreateCommentCommand,
  UpdateCommentCommand,
} from "@comments/usecases/comments/comment.commands";
import { CommentResponse } from "@comments/usecases/comments/comment.response";
import { CommentCommands } from "@comments/usecases/comments/comment.usecase.commands";
import { CommentQuery } from "@comments/usecases/comments/comment.usecase.queries";

@Controller("comments")
@ApiTags("comments")
export class CommentController {
  constructor(
    private commentCommands: CommentCommands,
    private commentQuery: CommentQuery
  ) {}

  @Post("create-comment")
  @ApiOkResponse({ type: CommentResponse })
  async createComment(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateCommentCommand
  ) {
    command.currentUser = user;
    return this.commentCommands.createComment(command);
  }

  @Put("update-comment")
  @ApiOkResponse({ type: CommentResponse })
  async updateComment(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateCommentCommand
  ) {
    command.currentUser = user;
    return this.commentCommands.updateComment(command);
  }

  @Delete("delete-comment/:id")
  @ApiOkResponse({ type: Boolean })
  async deleteComment(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.commentCommands.deleteComment(id, user);
  }

  @Get("get-comments/:mangaId")
  @ApiOkResponse({ type: CommentResponse, isArray: true })
  async getCommentsByManga(@Param("mangaId") mangaId: string) {
    return this.commentQuery.getCommentsByManga(mangaId);
  }

  @Get("my-comments")
  @ApiOkResponse({ type: CommentResponse, isArray: true })
  async getMyComments(@CurrentUser() user: UserInfo) {
    return this.commentQuery.getMyComments(user.id);
  }
}
