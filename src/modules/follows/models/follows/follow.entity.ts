import { BaseEntity } from "@libs/common/entities/base.entity";
import { Column, Entity, Index, Unique } from "typeorm";

@Entity({ name: "creator_follows" })
@Unique(["followerId", "creatorId"])
export class FollowEntity extends BaseEntity {
  @Index()
  @Column({ name: "follower_id" })
  followerId: string;

  @Column({ name: "creator_id" })
  creatorId: string;
}
