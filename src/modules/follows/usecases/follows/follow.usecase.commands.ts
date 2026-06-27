import { Injectable, NotFoundException } from "@nestjs/common";
import { FollowRepository } from "@follows/models/follows/follow.repository";
import { FollowCreatorCommand } from "./follow.commands";
import { FollowResponse } from "./follow.response";

@Injectable()
export class FollowCommands {
  constructor(private followRepository: FollowRepository) {}

  async followCreator(command: FollowCreatorCommand): Promise<FollowResponse> {
    const existing = await this.followRepository.getOneByMultiple({
      followerId: command.currentUser.id,
      creatorId: command.creatorId,
    });
    if (existing) {
      return FollowResponse.fromEntity(existing);
    }
    const follow = await this.followRepository.insert({
      followerId: command.currentUser.id,
      creatorId: command.creatorId,
      createdBy: command.currentUser?.id,
    } as any);
    return FollowResponse.fromEntity(follow);
  }

  async unfollowCreator(id: string, currentUser: { id: string }): Promise<boolean> {
    const follow = await this.followRepository.getById(id);
    if (!follow) throw new NotFoundException("Follow not found.");
    if (follow.followerId !== currentUser.id) {
      throw new NotFoundException("Follow not found.");
    }
    return this.followRepository.delete(id);
  }
}
