import { AllowAnonymous } from "@account/auth/decorators/allow-anonymous.decorator";
import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionsGuard } from "@account/auth/guards/permission.quard";
import { CollectionQuery } from "@libs/collection-query/collection-query";
import { ApiPaginatedResponse } from "@libs/response-format/api-paginated-response";
import { DataResponseFormat } from "@libs/response-format/data-response-format";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateMangaCommand,
  UpdateMangaCommand,
  UpdateMangaStatusCommand,
} from "@manga/usecases/mangas/manga.commands";
import { MangaResponse } from "@manga/usecases/mangas/manga.response";
import { MangaDetailResponse } from "@manga/usecases/mangas/manga-detail.response";
import { MangaCommands } from "@manga/usecases/mangas/manga.usecase.commands";
import { MangaQuery } from "@manga/usecases/mangas/manga.usecase.queries";

@Controller("manga")
@ApiTags("manga")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiResponse({ status: 404, description: "Item not found" })
@ApiExtraModels(DataResponseFormat)
export class MangaController {
  constructor(
    private mangaCommands: MangaCommands,
    private mangaQuery: MangaQuery
  ) {}

  @Get("public-mangas")
  @AllowAnonymous()
  @ApiPaginatedResponse(MangaResponse)
  async getPublicMangas(@Query() query: CollectionQuery) {
    return this.mangaQuery.getPublicMangas(query);
  }

  @Get("public-manga/:id")
  @AllowAnonymous()
  @ApiOkResponse({ type: MangaResponse })
  async getPublicManga(@Param("id") id: string) {
    return this.mangaQuery.getPublicManga(id);
  }

  @Get("public-manga-detail/:id")
  @AllowAnonymous()
  @ApiOkResponse({ type: MangaDetailResponse })
  async getPublicMangaDetail(@Param("id") id: string) {
    return this.mangaQuery.getPublicMangaDetail(id);
  }

  @Get("get-manga/:id")
  @ApiOkResponse({ type: MangaResponse })
  async getManga(@Param("id") id: string) {
    return this.mangaQuery.getManga(id);
  }

  @Get("get-mangas")
  @UseGuards(PermissionsGuard("manage-manga"))
  @ApiPaginatedResponse(MangaResponse)
  async getMangas(@Query() query: CollectionQuery) {
    return this.mangaQuery.getMangas(query);
  }

  @Get("pending-mangas")
  @UseGuards(PermissionsGuard("manage-manga"))
  @ApiPaginatedResponse(MangaResponse)
  async getPendingMangas(@Query() query: CollectionQuery) {
    return this.mangaQuery.getPendingMangas(query);
  }

  @Get("my-mangas")
  @ApiPaginatedResponse(MangaResponse)
  async getMyMangas(
    @CurrentUser() user: UserInfo,
    @Query() query: CollectionQuery
  ) {
    return this.mangaQuery.getMyMangas(user.id, query);
  }

  @Post("create-manga")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: MangaResponse })
  async createManga(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateMangaCommand
  ) {
    command.currentUser = user;
    return this.mangaCommands.createManga(command);
  }

  @Put("update-manga")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: MangaResponse })
  async updateManga(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateMangaCommand
  ) {
    command.currentUser = user;
    return this.mangaCommands.updateManga(command);
  }

  @Put("update-manga-status")
  @UseGuards(PermissionsGuard("manage-manga"))
  @ApiOkResponse({ type: MangaResponse })
  async updateMangaStatus(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateMangaStatusCommand
  ) {
    command.currentUser = user;
    return this.mangaCommands.updateMangaStatus(command);
  }

  @Post("update-manga-cover/:id")
  @UseGuards(PermissionsGuard("create-manga"))
  @UseInterceptors(mangaCoverInterceptor())
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ type: MangaResponse })
  async updateMangaCover(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string,
    @UploadedFile() cover: Express.Multer.File
  ) {
    return this.mangaCommands.updateMangaCover(id, cover, user);
  }

  @Post("update-manga-pdf/:id")
  @UseGuards(PermissionsGuard("create-manga"))
  @UseInterceptors(mangaPdfInterceptor())
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ type: MangaResponse })
  async updateMangaPdf(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string,
    @UploadedFile() pdf: Express.Multer.File
  ) {
    return this.mangaCommands.updateMangaPdf(id, pdf, user);
  }

  @Delete("delete-manga/:id")
  @UseGuards(PermissionsGuard("create-manga"))
  @ApiOkResponse({ type: Boolean })
  async deleteManga(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.mangaCommands.deleteManga(id, user);
  }
}

function mangaCoverInterceptor() {
  return FileInterceptor("cover", {
    fileFilter: (request, file, callback) => {
      if (!file.mimetype?.includes("image")) {
        return callback(new BadRequestException("Provide a valid image file"), false);
      }
      callback(null, true);
    },
    limits: { fileSize: Math.pow(1024, Number(process.env.MAX_FILE_SIZE || 4)) },
  });
}

function mangaPdfInterceptor() {
  return FileInterceptor("pdf", {
    fileFilter: (request, file, callback) => {
      if (file.mimetype !== "application/pdf") {
        return callback(new BadRequestException("Provide a valid PDF file"), false);
      }
      callback(null, true);
    },
    limits: { fileSize: Math.pow(1024, Number(process.env.MAX_FILE_SIZE || 4)) },
  });
}
