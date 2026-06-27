import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "../db/data-source";
import { EmployeeModule } from "@employee/employee.module";
import { AccountModule } from "@account/account.module";
import { ActivityModule } from "@activity-logger/activity-logger.module";
import { FileManagerModule } from "@libs/common/file-manager";
import { ConfigurationsModule } from "@configurations/configurations.module";
import { MangaModule } from "@manga/manga.module";
import { ChapterModule } from "@chapters/chapter.module";
import { ChapterPagesModule } from "@chapter-pages/chapter-pages.module";
import { BookmarkModule } from "@bookmarks/bookmark.module";
import { FollowModule } from "@follows/follow.module";
import { CommentModule } from "@comments/comment.module";
import { ReportModule } from "@reports/report.module";
import { AnalyticsModule } from "@analytics/analytics.module";
import { ScheduleModule } from "@nestjs/schedule";

import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "@nestjs/config";
import * as dotenv from "dotenv";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

import { SharedModule } from "./shared.module";
import { APP_GUARD } from "@nestjs/core";
import { UserStatusGuard } from "@account/auth/guards/user-validation.guard";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../..", "src/.well-known"),
      serveRoot: "/.well-known",
    }),
    EventEmitterModule.forRoot({
      maxListeners: 10,
      verboseMemoryLeak: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    EmployeeModule,
    AccountModule,
    ActivityModule,
    FileManagerModule,
    ConfigurationsModule,
    MangaModule,
    ChapterModule,
    ChapterPagesModule,
    BookmarkModule,
    FollowModule,
    CommentModule,
    ReportModule,
    AnalyticsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: UserStatusGuard,
    },
  ],
})
export class AppModule {}
