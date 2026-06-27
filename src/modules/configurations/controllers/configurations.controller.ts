import { AllowAnonymous } from "@account/auth/decorators/allow-anonymous.decorator";
import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionsGuard } from "@account/auth/guards/permission.quard";
import {
  ArchiveConfigurationCommand,
  CreateConfigurationCommand,
  UpdateConfigurationCommand,
} from "@configurations/usecases/configuration/configuration.commands";
import { ConfigurationResponse } from "@configurations/usecases/configuration/configuration.response";
import { PublicConfigurationResponse } from "@configurations/usecases/configuration/public-configuration.response";
import { ConfigurationCommands } from "@configurations/usecases/configuration/configuration.usecase.commands";
import { ConfigurationQuery } from "@configurations/usecases/configuration/configuration.usecase.queries";
import { CollectionQuery } from "@libs/collection-query/collection-query";
import { IncludeQuery } from "@libs/collection-query/include-query";
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

@Controller("configurations")
@ApiTags("configurations")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiResponse({ status: 404, description: "Item not found" })
@ApiExtraModels(DataResponseFormat)
export class ConfigurationsController {
  constructor(
    private command: ConfigurationCommands,
    private configurationQuery: ConfigurationQuery
  ) {}
  @Get("get-configuration/:id")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: ConfigurationResponse })
  async getConfiguration(
    @Param("id") id: string,
    @Query() includeQuery: IncludeQuery
  ) {
    return this.configurationQuery.getConfiguration(id, includeQuery.includes);
  }
  @Get("get-configurations")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: ConfigurationResponse })
  async getConfigurations(@Query() query: CollectionQuery) {
    return this.configurationQuery.getConfigurations(query);
  }
  @Get("public")
  @AllowAnonymous()
  @ApiOkResponse({ type: PublicConfigurationResponse })
  async getPublicConfiguration(@Query() query: CollectionQuery) {
    return this.configurationQuery.getPublicConfiguration(query);
  }
  @Post("create-configuration")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: ConfigurationResponse })
  async createConfiguration(
    @CurrentUser() user: UserInfo,
    @Body() createConfigurationCommand: CreateConfigurationCommand
  ) {
    createConfigurationCommand.currentUser = user;
    return this.command.createConfiguration(createConfigurationCommand);
  }
  @Put("update-configuration")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: ConfigurationResponse })
  async updateConfiguration(
    @CurrentUser() user: UserInfo,
    @Body() updateConfigurationCommand: UpdateConfigurationCommand
  ) {
    updateConfigurationCommand.currentUser = user;
    return this.command.updateConfiguration(updateConfigurationCommand);
  }
  @Delete("archive-configuration")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: Boolean })
  async archiveConfiguration(
    @CurrentUser() user: UserInfo,
    @Body() command: ArchiveConfigurationCommand
  ) {
    command.currentUser = user;
    return this.command.archiveConfiguration(command);
  }
  @Delete("delete-configuration/:id")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: Boolean })
  async deleteConfiguration(@Param("id") id: string) {
    return this.command.deleteConfiguration(id);
  }
  @Post("restore-configuration/:id")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiOkResponse({ type: ConfigurationResponse })
  async restoreConfiguration(@Param("id") id: string) {
    return this.command.restoreConfiguration(id);
  }
  @Get("get-archived-configurations")
  @UseGuards(PermissionsGuard("manage-configurations"))
  @ApiPaginatedResponse(ConfigurationResponse)
  async getArchivedConfigurations(@Query() query: CollectionQuery) {
    return this.configurationQuery.getArchivedConfigurations(query);
  }
}
