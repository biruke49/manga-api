import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportController } from "./controllers/report.controller";
import { ReportEntity } from "./models/reports/report.entity";
import { ReportRepository } from "./models/reports/report.repository";
import { ReportCommands } from "./usecases/reports/report.usecase.commands";
import { ReportQuery } from "./usecases/reports/report.usecase.queries";

@Module({
  controllers: [ReportController],
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  providers: [ReportRepository, ReportCommands, ReportQuery],
})
export class ReportModule {}
