import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FollowEntity } from "@follows/models/follows/follow.entity";
import { FollowResponse } from "./follow.response";

@Injectable()
export class FollowQuery {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>
  ) {}

  async getMyFollows(followerId: string): Promise<FollowResponse[]> {
    const follows = await this.followRepository.find({
      where: { followerId },
      order: { createdAt: "DESC" },
    });
    return follows.map((entity) => FollowResponse.fromEntity(entity));
  }

  async getCreatorFollowers(creatorId: string): Promise<FollowResponse[]> {
    const follows = await this.followRepository.find({
      where: { creatorId },
      order: { createdAt: "DESC" },
    });
    return follows.map((entity) => FollowResponse.fromEntity(entity));
  }

  async getCreatorFollowersCount(creatorId: string): Promise<number> {
    return this.followRepository.count({ where: { creatorId } });
  }
}
