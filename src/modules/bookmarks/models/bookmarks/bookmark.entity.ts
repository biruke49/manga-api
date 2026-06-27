import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index, Unique } from "typeorm";

@Entity({ name: "manga_bookmarks" })
@Unique(["userId", "mangaId"])
export class BookmarkEntity extends BaseEntity {
  @Index()
  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "manga_id" })
  mangaId: string;

  @Column({ name: "last_chapter_id", nullable: true })
  lastChapterId: string;
}
