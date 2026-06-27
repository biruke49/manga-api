import { diskStorage } from "multer";

import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionsGuard } from "@account/auth/guards/permission.quard";
import { CollectionQuery } from "@libs/collection-query/collection-query";
import { FileManagerHelper } from "@libs/common/file-manager";
import { FileManagerService } from "@libs/common/file-manager/file-manager.service";
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
  ArchiveEmployeeCommand,
  CreateEmployeeCommand,
  UpdateEmployeeCommand,
} from "@employee/usecases/employees/employee.commands";
import { EmployeeResponse } from "@employee/usecases/employees/employee.response";
import { EmployeeCommands } from "@employee/usecases/employees/employee.usecase.commands";
import { EmployeeQuery } from "@employee/usecases/employees/employee.usecase.queries";
import { GroupByStatusResponse } from "@libs/common/count-by";
import { IncludeQuery } from "@libs/collection-query/include-query";

@Controller("employees")
@ApiTags("employees")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiResponse({ status: 404, description: "Item not found" })
@ApiExtraModels(DataResponseFormat)
export class EmployeeController {
  constructor(
    private command: EmployeeCommands,
    private employeeQuery: EmployeeQuery,
    private readonly fileManagerService: FileManagerService
  ) {}
  @Get("get-employee/:id")
  @UseGuards(PermissionsGuard("manage-employees|view-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async getEmployee(
    @Param("id") id: string,
    @Query() includeQuery: IncludeQuery
  ) {
    return this.employeeQuery.getEmployee(id, includeQuery.includes);
  }
  @Get("get-archived-employee/:id")
  @UseGuards(PermissionsGuard("manage-employees|view-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async getArchivedEmployee(
    @Param("id") id: string,
    @Query() includeQuery: IncludeQuery
  ) {
    return this.employeeQuery.getEmployee(id, includeQuery.includes, true);
  }
  @Get("get-employees")
  @UseGuards(PermissionsGuard("manage-employees|view-employees"))
  @ApiPaginatedResponse(EmployeeResponse)
  async getEmployees(@Query() query: CollectionQuery) {
    return this.employeeQuery.getEmployees(query);
  }
  @Get("group-employees-by-status")
  @UseGuards(PermissionsGuard("manage-employees|view-employees"))
  @ApiOkResponse({ type: GroupByStatusResponse, isArray: true })
  async groupEmployeesByStatus(@Query() query: CollectionQuery) {
    return this.employeeQuery.groupEmployeesByStatus(query);
  }
  @Post("create-employee")
  //@AllowAnonymous()
  @UseGuards(PermissionsGuard("manage-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async createEmployee(
    @CurrentUser() user: UserInfo,
    @Body() createEmployeeCommand: CreateEmployeeCommand
  ) {
    createEmployeeCommand.currentUser = user;
    return this.command.createEmployee(createEmployeeCommand);
  }
  @Put("update-employee")
  @UseGuards(PermissionsGuard("manage-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async updateEmployee(
    @CurrentUser() user: UserInfo,
    @Body() updateEmployeeCommand: UpdateEmployeeCommand
  ) {
    updateEmployeeCommand.currentUser = user;
    return this.command.updateEmployee(updateEmployeeCommand);
  }
  @Delete("archive-employee")
  @UseGuards(PermissionsGuard("manage-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async archiveEmployee(
    @CurrentUser() user: UserInfo,
    @Body() archiveCommand: ArchiveEmployeeCommand
  ) {
    archiveCommand.currentUser = user;
    return this.command.archiveEmployee(archiveCommand);
  }
  @Delete("delete-employee/:id")
  @UseGuards(PermissionsGuard("manage-employees"))
  @ApiOkResponse({ type: Boolean })
  async deleteEmployee(@CurrentUser() user: UserInfo, @Param("id") id: string) {
    return this.command.deleteEmployee(id, user);
  }
  @Post("restore-employee/:id")
  @UseGuards(PermissionsGuard("manage-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async restoreEmployee(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.command.restoreEmployee(id, user);
  }
  @Get("get-archived-employees")
  @UseGuards(PermissionsGuard("manage-employees|view-employees"))
  @ApiPaginatedResponse(EmployeeResponse)
  async getArchivedEmployees(@Query() query: CollectionQuery) {
    return this.employeeQuery.getArchivedEmployees(query);
  }
  @Post("activate-or-block-employee/:id")
  @UseGuards(PermissionsGuard("manage-employees"))
  @ApiOkResponse({ type: EmployeeResponse })
  async activateOrBlockEmployee(
    @CurrentUser() user: UserInfo,
    @Param("id") id: string
  ) {
    return this.command.activateOrBlockEmployee(id, user);
  }
}
