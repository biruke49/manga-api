import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MangaEntity } from "./manga.entity";

@Injectable()
export class MangaRepository extends BaseRepository<MangaEntity> {
  constructor(
    @InjectRepository(MangaEntity)
    mangaRepository: Repository<MangaEntity>
  ) {
    super(mangaRepository);
  }
}
