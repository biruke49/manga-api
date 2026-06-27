import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MangaEntity, MangaStatus } from "@manga/models/mangas/manga.entity";
import { ChapterEntity, ChapterStatus } from "@chapters/models/chapters/chapter.entity";
import { ReportEntity, ReportStatus } from "@reports/models/reports/report.entity";
import { FollowEntity } from "@follows/models/follows/follow.entity";
import { AccountEntity } from "@account/models/accounts/account.entity";
import { AdminStatsResponse, CreatorStatsResponse } from "./analytics.response";

@Injectable()
export class AnalyticsQuery {
  constructor(
    @InjectRepository(MangaEntity)
    private mangaRepository: Repository<MangaEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepository: Repository<ChapterEntity>,
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>
  ) {}

  async getAdminStats(): Promise<AdminStatsResponse> {
    const stats = new AdminStatsResponse();

    const mangaCounts = await this.mangaRepository
      .createQueryBuilder("m")
      .select("m.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("m.status")
      .getRawMany<{ status: string; count: string }>();

    stats.totalMangas = mangaCounts.reduce((sum, r) => sum + Number(r.count), 0);
    stats.publishedMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Published)?.count || 0);
    stats.pendingMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Pending)?.count || 0);
    stats.draftMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Draft)?.count || 0);
    stats.rejectedMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Rejected)?.count || 0);

    const chapterCounts = await this.chapterRepository
      .createQueryBuilder("c")
      .select("c.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("c.status")
      .getRawMany<{ status: string; count: string }>();

    stats.totalChapters = chapterCounts.reduce((sum, r) => sum + Number(r.count), 0);
    stats.pendingChapters = Number(chapterCounts.find((r) => r.status === ChapterStatus.Pending)?.count || 0);
    stats.publishedChapters = Number(chapterCounts.find((r) => r.status === ChapterStatus.Published)?.count || 0);

    const userCounts = await this.accountRepository
      .createQueryBuilder("a")
      .select("a.type", "type")
      .addSelect("COUNT(*)", "count")
      .groupBy("a.type")
      .getRawMany<{ type: string; count: string }>();

    stats.totalUsers = userCounts.reduce((sum, r) => sum + Number(r.count), 0);
    stats.totalReaders = Number(userCounts.find((r) => r.type === "reader")?.count || 0);
    stats.totalCreators = Number(userCounts.find((r) => r.type === "creator")?.count || 0);
    stats.totalAdmins = Number(userCounts.find((r) => r.type === "admin")?.count || 0);

    stats.pendingReports = await this.reportRepository.count({
      where: { status: ReportStatus.Pending },
    });

    return stats;
  }

  async getCreatorStats(creatorId: string): Promise<CreatorStatsResponse> {
    const stats = new CreatorStatsResponse();

    const mangaCounts = await this.mangaRepository
      .createQueryBuilder("m")
      .select("m.status", "status")
      .addSelect("COUNT(*)", "count")
      .where("m.authorId = :authorId", { authorId: creatorId })
      .groupBy("m.status")
      .getRawMany<{ status: string; count: string }>();

    stats.totalMangas = mangaCounts.reduce((sum, r) => sum + Number(r.count), 0);
    stats.publishedMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Published)?.count || 0);
    stats.pendingMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Pending)?.count || 0);
    stats.draftMangas = Number(mangaCounts.find((r) => r.status === MangaStatus.Draft)?.count || 0);

    stats.totalChapters = await this.chapterRepository.count({
      where: { authorId: creatorId },
    });

    stats.publishedChapters = await this.chapterRepository.count({
      where: { authorId: creatorId, status: ChapterStatus.Published },
    });

    stats.followerCount = await this.followRepository.count({
      where: { creatorId },
    });

    return stats;
  }
}
