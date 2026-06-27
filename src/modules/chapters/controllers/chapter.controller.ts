import { AllowAnonymous } from "@account/auth/decorators/allow-anonymous.decorator";
import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionsGuard } from "@account/auth/guards/permission.quard";
import { CollectionQuery } from "@libs/collection-query/collection-query";
import { ApiPaginatedResponse } from "@libs/response-format/api-paginated-response";
import { DataResponseFormat } from "@libs/response-format/data-response-format";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateChapterCommand,
  UpdateChapterCommand,
  UpdateChapterStatusCommand,
} from "@chapters/usecases/chapters/chapter.commands";
import { ChapterResponse } from "@chapters/usecases/chapters/chapter.response";
import { ReaderResponse } from "@chapters/usecases/chapters/reader.response";
import { ChapterCommands } from "@chapters/usecases/chapters/chapter.usecase.commands";
import { ChapterQuery } from "@chapters/usecases/chapters/chapter.usecase.queries";

@Controller("chapters")
@ApiTags("chapters")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiResponse({ status: 404, description: "Item not found" })
@ApiExtraModels(DataResponseFormat)
export class ChapterController {
  constructor(
    private chapterCommands: ChapterCommands,
    private chapterQuery: ChapterQuery
  ) {}

  @Get("public-chapters/:mangaId")
  @AllowAnonymous()
  @ApiOkResponse({ type: ChapterResponse, isArray: true })
  async getPublicChapters(@Param("mangaId") mangaId: string) {
    return this.chapterQuery.getPublicChapters(mangaId);
  }

  @Get("reader/:id")
  @AllowAnonymous()
  @ApiOkResponse({ type: ReaderResponse })
  async getReaderChapter(@Param("id") id: string) {
    return this.chapterQuery.getReaderChapter(id);
  }

  @Get("get-chapter/:id")
  @ApiOkResponse({ type: ChapterResponse })
  async getChapter(@Param("id") id: string) {
    return this.chapterQuery.getChapter(id);
  }

  @Get("get-chapters")
  @ApiPaginatedResponse(ChapterResponse)
  async getChapters(@Query() query: CollectionQuery) {
    return this.chapterQuery.getChapters(query);
  }

  @Get("chapters-by-manga/:mangaId")
  @ApiPaginatedResponse(ChapterResponse)
  async getChaptersByManga(
    @Param("mangaId") mangaId: string,
    @Query() query: CollectionQuery
  ) {
    return this.chapterQuery.getChaptersByManga(mangaId, query);
  }

  @Get("pending-chapters")
  @UseGuards(PermissionsGuard("manage-manga"))
  @ApiPaginatedResponse(ChapterResponse)
  async getPendingChapters(@Query() query: CollectionQuery) {
    return this.chapterQuery.getPendingChapters(query);
  }

  @Get("my-chapters")
  @ApiPaginatedResponse(ChapterResponse)
  async getMyChapters(
    @CurrentUser() user: UserInfo,
    @Query() query: CollectionQuery
  ) {
    return this.chapterQuery.getMyChapters(user.id, query);
  }

  @Post("create-chapter")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: ChapterResponse })
  async createChapter(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateChapterCommand
  ) {
    command.currentUser = user;
    return this.chapterCommands.createChapter(command);
  }

  @Put("update-chapter")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: ChapterResponse })
  async updateChapter(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateChapterCommand
  ) {
    command.currentUser = user;
    return this.chapterCommands.updateChapter(command);
  }

  @Put("update-chapter-status")
  @UseGuards(PermissionsGuard("manage-manga"))
  @ApiOkResponse({ type: ChapterResponse })
  async updateChapterStatus(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateChapterStatusCommand
  ) {
    command.currentUser = user;
    return this.chapterCommands.updateChapterStatus(command);
  }

  @Delete("delete-chapter/:id")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: Boolean })
  async deleteChapter(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.chapterCommands.deleteChapter(id, user);
  }
}
