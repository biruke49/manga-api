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
  Get,
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
  CreateReportCommand,
  UpdateReportStatusCommand,
} from "@reports/usecases/reports/report.commands";
import { ReportResponse } from "@reports/usecases/reports/report.response";
import { ReportCommands } from "@reports/usecases/reports/report.usecase.commands";
import { ReportQuery } from "@reports/usecases/reports/report.usecase.queries";

@Controller("reports")
@ApiTags("reports")
@ApiResponse({ status: 500, description: "Internal error" })
@ApiResponse({ status: 404, description: "Item not found" })
@ApiExtraModels(DataResponseFormat)
export class ReportController {
  constructor(
    private reportCommands: ReportCommands,
    private reportQuery: ReportQuery
  ) {}

  @Post("create-report")
  @ApiOkResponse({ type: ReportResponse })
  async createReport(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateReportCommand
  ) {
    command.currentUser = user;
    return this.reportCommands.createReport(command);
  }

  @Get("get-reports")
  @UseGuards(PermissionsGuard("manage-reports"))
  @ApiPaginatedResponse(ReportResponse)
  async getReports(@Query() query: CollectionQuery) {
    return this.reportQuery.getReports(query);
  }

  @Get("my-reports")
  @ApiOkResponse({ type: ReportResponse, isArray: true })
  async getMyReports(@CurrentUser() user: UserInfo) {
    return this.reportQuery.getMyReports(user.id);
  }

  @Put("update-report-status")
  @UseGuards(PermissionsGuard("manage-reports"))
  @ApiOkResponse({ type: ReportResponse })
  async updateReportStatus(
    @CurrentUser() user: UserInfo,
    @Body() command: UpdateReportStatusCommand
  ) {
    command.currentUser = user;
    return this.reportCommands.updateReportStatus(command);
  }
}
