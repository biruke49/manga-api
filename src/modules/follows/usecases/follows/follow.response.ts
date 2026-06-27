import { ApiProperty } from "@nestjs/swagger";
import { FollowEntity } from "@follows/models/follows/follow.entity";

export class FollowResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  followerId: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: FollowEntity): FollowResponse {
    const response = new FollowResponse();
    response.id = entity.id;
    response.followerId = entity.followerId;
    response.creatorId = entity.creatorId;
    response.createdAt = entity.createdAt;
    return response;
  }
}
