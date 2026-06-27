import { AllowAnonymous } from "@account/auth/decorators/allow-anonymous.decorator";
import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionsGuard } from "@account/auth/guards/permission.quard";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ReorderPagesCommand } from "@chapter-pages/usecases/pages/page.commands";
import { PageResponse } from "@chapter-pages/usecases/pages/page.response";
import { PageCommands } from "@chapter-pages/usecases/pages/page.usecase.commands";
import { PageQuery } from "@chapter-pages/usecases/pages/page.usecase.queries";

@Controller("chapter-pages")
@ApiTags("chapter-pages")
export class PageController {
  constructor(
    private pageCommands: PageCommands,
    private pageQuery: PageQuery
  ) {}

  @Get("get-pages/:chapterId")
  @ApiOkResponse({ type: PageResponse, isArray: true })
  async getPages(@Param("chapterId") chapterId: string) {
    return this.pageQuery.getPages(chapterId);
  }

  @Get("public-pages/:chapterId")
  @AllowAnonymous()
  @ApiOkResponse({ type: PageResponse, isArray: true })
  async getPublicPages(@Param("chapterId") chapterId: string) {
    return this.pageQuery.getPublicPages(chapterId);
  }

  @Post("upload-pages/:chapterId")
  @UseGuards(PermissionsGuard("create-manga"))
  @UseInterceptors(chapterPagesInterceptor())
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ type: PageResponse, isArray: true })
  async uploadPages(
    @CurrentUser() user: UserInfo,
    @Param("chapterId") chapterId: string,
    @UploadedFiles() pages: Express.Multer.File[]
  ) {
    return this.pageCommands.uploadPages(chapterId, pages, user);
  }

  @Put("reorder-pages")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: PageResponse, isArray: true })
  async reorderPages(
    @CurrentUser() user: UserInfo,
    @Body() command: ReorderPagesCommand
  ) {
    command.currentUser = user;
    return this.pageCommands.reorderPages(command);
  }

  @Delete("delete-page/:id")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: Boolean })
  async deletePage(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.pageCommands.deletePage(id, user);
  }
}

function chapterPagesInterceptor() {
  return FilesInterceptor("pages", undefined, {
    fileFilter: (request, file, callback) => {
      if (!file.mimetype?.includes("image")) {
        return callback(new BadRequestException("Provide valid image files"), false);
      }
      callback(null, true);
    },
    limits: { fileSize: Math.pow(1024, Number(process.env.MAX_FILE_SIZE || 4)) },
  });
}
