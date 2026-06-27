import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index } from "typeorm";

@Entity({ name: "chapter_pages" })
export class ChapterPageEntity extends BaseEntity {
  @Index()
  @Column({ name: "chapter_id" })
  chapterId: string;

  @Column({ name: "page_number" })
  pageNumber: number;

  @Column({ name: "image_filename" })
  imageFilename: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;
}
