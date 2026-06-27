import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowController } from "./controllers/follow.controller";
import { FollowEntity } from "./models/follows/follow.entity";
import { FollowRepository } from "./models/follows/follow.repository";
import { FollowCommands } from "./usecases/follows/follow.usecase.commands";
import { FollowQuery } from "./usecases/follows/follow.usecase.queries";

@Module({
  controllers: [FollowController],
  imports: [TypeOrmModule.forFeature([FollowEntity])],
  providers: [FollowRepository, FollowCommands, FollowQuery],
})
export class FollowModule {}
