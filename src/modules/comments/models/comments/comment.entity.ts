import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

@Entity({ name: "comments" })
export class CommentEntity extends BaseEntity {
  @Index()
  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "manga_id" })
  mangaId: string;

  @Column({ name: "chapter_id", nullable: true })
  chapterId: string;

  @Column({ type: "text" })
  content: string;

  @Column({ name: "parent_id", nullable: true })
  parentId: string;
}
