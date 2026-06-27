import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChapterPageEntity } from "./page.entity";

@Injectable()
export class PageRepository extends BaseRepository<ChapterPageEntity> {
  constructor(
    @InjectRepository(ChapterPageEntity)
    pageRepository: Repository<ChapterPageEntity>
  ) {
    super(pageRepository);
  }
}
