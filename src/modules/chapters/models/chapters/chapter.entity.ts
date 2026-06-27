import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

export enum ChapterStatus {
  Draft = "draft",
  Pending = "pending",
  Published = "published",
  Rejected = "rejected",
}

@Entity({ name: "chapters" })
export class ChapterEntity extends BaseEntity {
  @Index()
  @Column({ name: "manga_id" })
  mangaId: string;

  @Column()
  title: string;

  @Column({ name: "chapter_number", type: "numeric" })
  chapterNumber: number;

  @Index()
  @Column({ type: "varchar", default: ChapterStatus.Draft })
  status: ChapterStatus;

  @Column({ name: "page_count", default: 0 })
  pageCount: number;

  @Column({ name: "author_id" })
  authorId: string;

  @Column({ type: "text", nullable: true, name: "rejection_reason" })
  rejectionReason: string;
}
