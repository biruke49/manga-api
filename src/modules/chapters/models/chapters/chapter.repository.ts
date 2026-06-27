import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChapterEntity } from "./chapter.entity";

@Injectable()
export class ChapterRepository extends BaseRepository<ChapterEntity> {
  constructor(
    @InjectRepository(ChapterEntity)
    chapterRepository: Repository<ChapterEntity>
  ) {
    super(chapterRepository);
  }
}
