import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

export enum ReportStatus {
  Pending = "pending",
  Reviewed = "reviewed",
  Dismissed = "dismissed",
}

@Entity({ name: "reports" })
export class ReportEntity extends BaseEntity {
  @Index()
  @Column({ name: "reporter_id" })
  reporterId: string;

  @Column({ name: "manga_id", nullable: true })
  mangaId: string;

  @Column({ name: "chapter_id", nullable: true })
  chapterId: string;

  @Column({ name: "comment_id", nullable: true })
  commentId: string;

  @Column({ type: "text" })
  reason: string;

  @Index()
  @Column({ type: "varchar", default: ReportStatus.Pending })
  status: ReportStatus;

  @Column({ name: "admin_note", type: "text", nullable: true })
  adminNote: string;
}
