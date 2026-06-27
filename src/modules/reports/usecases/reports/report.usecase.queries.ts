import { CollectionQuery } from "@libs/collection-query/collection-query";
import { QueryConstructor } from "@libs/collection-query/query-constructor";
import { DataResponseFormat } from "@libs/response-format/data-response-format";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReportEntity } from "@reports/models/reports/report.entity";
import { ReportResponse } from "./report.response";

@Injectable()
export class ReportQuery {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>
  ) {}

  async getReports(
    query: CollectionQuery
  ): Promise<DataResponseFormat<ReportResponse>> {
    const dataQuery = QueryConstructor.constructQuery<ReportEntity>(
      this.reportRepository,
      query
    );
    const response = new DataResponseFormat<ReportResponse>();
    const [result, total] = await dataQuery.getManyAndCount();
    response.data = result.map((entity) => ReportResponse.fromEntity(entity));
    response.count = total;
    return response;
  }

  async getMyReports(
    reporterId: string
  ): Promise<ReportResponse[]> {
    const reports = await this.reportRepository.find({
      where: { reporterId },
      order: { createdAt: "DESC" },
    });
    return reports.map((entity) => ReportResponse.fromEntity(entity));
  }
}
