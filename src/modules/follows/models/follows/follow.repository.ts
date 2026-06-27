import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FollowEntity } from "./follow.entity";

@Injectable()
export class FollowRepository extends BaseRepository<FollowEntity> {
  constructor(
    @InjectRepository(FollowEntity)
    followRepository: Repository<FollowEntity>
  ) {
    super(followRepository);
  }
}
