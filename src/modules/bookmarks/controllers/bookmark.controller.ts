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
import { AddBookmarkCommand } from "@bookmarks/usecases/bookmarks/bookmark.commands";
import { BookmarkResponse } from "@bookmarks/usecases/bookmarks/bookmark.response";
import { BookmarkCommands } from "@bookmarks/usecases/bookmarks/bookmark.usecase.commands";
import { BookmarkQuery } from "@bookmarks/usecases/bookmarks/bookmark.usecase.queries";

@Controller("bookmarks")
@ApiTags("bookmarks")
export class BookmarkController {
  constructor(
    private bookmarkCommands: BookmarkCommands,
    private bookmarkQuery: BookmarkQuery
  ) {}

  @Post("add-bookmark")
  @ApiOkResponse({ type: BookmarkResponse })
  async addBookmark(
    @CurrentUser() user: UserInfo,
    @Body() command: AddBookmarkCommand
  ) {
    command.currentUser = user;
    return this.bookmarkCommands.addBookmark(command);
  }

  @Delete("remove-bookmark/:id")
  @ApiOkResponse({ type: Boolean })
  async removeBookmark(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.bookmarkCommands.removeBookmark(id, user);
  }

  @Get("my-bookmarks")
  @ApiOkResponse({ type: BookmarkResponse, isArray: true })
  async getMyBookmarks(@CurrentUser() user: UserInfo) {
    return this.bookmarkQuery.getMyBookmarks(user.id);
  }
}
