import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

export enum MangaStatus {
  Draft = "draft",
  Pending = "pending",
  Published = "published",
  Rejected = "rejected",
  Archived = "archived",
}

@Entity({ name: "mangas" })
export class MangaEntity extends BaseEntity {
  @Index()
  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "cover_image_filename", nullable: true })
  coverImageFilename: string;

  @Index()
  @Column({ type: "varchar", default: MangaStatus.Draft })
  status: MangaStatus;

  @Column({ name: "author_id" })
  authorId: string;

  @Column({ nullable: true })
  artist: string;

  @Column({ type: "text", array: true, nullable: true })
  genres: string[];

  @Column({ type: "text", array: true, nullable: true })
  tags: string[];

  @Column({ default: "am" })
  language: string;

  @Column({ name: "is_mature", default: false })
  isMature: boolean;

  @Column({ type: "text", nullable: true })
  rejectionReason: string;
}
