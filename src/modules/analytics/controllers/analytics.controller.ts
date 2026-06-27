import { CurrentUser } from "@account/auth/decorators/current-user.decorator";
import { UserInfo } from "@account/auth/dtos/user-info.dto";
import { PermissionsGuard } from "@account/auth/guards/permission.quard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  AdminStatsResponse,
  CreatorStatsResponse,
} from "@analytics/usecases/analytics/analytics.response";
import { AnalyticsQuery } from "@analytics/usecases/analytics/analytics.usecase.queries";

@Controller("analytics")
@ApiTags("analytics")
export class AnalyticsController {
  constructor(private analyticsQuery: AnalyticsQuery) {}

  @Get("admin-stats")
  @UseGuards(PermissionsGuard("manage-manga"))
  @ApiOkResponse({ type: AdminStatsResponse })
  async getAdminStats() {
    return this.analyticsQuery.getAdminStats();
  }

  @Get("creator-stats")
  @ApiOkResponse({ type: CreatorStatsResponse })
  async getCreatorStats(@CurrentUser() user: UserInfo) {
    return this.analyticsQuery.getCreatorStats(user.id);
  }
}
