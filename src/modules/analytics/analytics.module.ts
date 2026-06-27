import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnalyticsController } from "./controllers/analytics.controller";
import { AnalyticsQuery } from "./usecases/analytics/analytics.usecase.queries";
import { MangaEntity } from "@manga/models/mangas/manga.entity";
import { ChapterEntity } from "@chapters/models/chapters/chapter.entity";
import { ReportEntity } from "@reports/models/reports/report.entity";
import { FollowEntity } from "@follows/models/follows/follow.entity";
import { AccountEntity } from "@account/models/accounts/account.entity";

@Module({
  controllers: [AnalyticsController],
  imports: [
    TypeOrmModule.forFeature([
      MangaEntity,
      ChapterEntity,
      ReportEntity,
      FollowEntity,
      AccountEntity,
    ]),
  ],
  providers: [AnalyticsQuery],
})
export class AnalyticsModule {}
