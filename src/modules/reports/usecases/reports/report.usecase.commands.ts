import { Injectable, NotFoundException } from "@nestjs/common";
import { ReportRepository } from "@reports/models/reports/report.repository";
import {
  CreateReportCommand,
  UpdateReportStatusCommand,
} from "./report.commands";
import { ReportResponse } from "./report.response";

@Injectable()
export class ReportCommands {
  constructor(private reportRepository: ReportRepository) {}

  async createReport(command: CreateReportCommand): Promise<ReportResponse> {
    const report = await this.reportRepository.insert({
      reporterId: command.currentUser.id,
      mangaId: command.mangaId,
      chapterId: command.chapterId,
      commentId: command.commentId,
      reason: command.reason,
      status: "pending",
      createdBy: command.currentUser?.id,
    } as any);
    return ReportResponse.fromEntity(report);
  }

  async updateReportStatus(
    command: UpdateReportStatusCommand
  ): Promise<ReportResponse> {
    const report = await this.reportRepository.getById(command.id);
    if (!report) throw new NotFoundException("Report not found.");
    report.status = command.status;
    if (command.adminNote) {
      report.adminNote = command.adminNote;
    }
    report.updatedBy = command.currentUser?.id;
    const updated = await this.reportRepository.update(command.id, report);
    return ReportResponse.fromEntity(updated);
  }
}
