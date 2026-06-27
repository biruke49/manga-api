import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReportEntity } from "./report.entity";

@Injectable()
export class ReportRepository extends BaseRepository<ReportEntity> {
  constructor(
    @InjectRepository(ReportEntity)
    reportRepository: Repository<ReportEntity>
  ) {
    super(reportRepository);
  }
}
