import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentController } from "./controllers/comment.controller";
import { CommentEntity } from "./models/comments/comment.entity";
import { CommentRepository } from "./models/comments/comment.repository";
import { CommentCommands } from "./usecases/comments/comment.usecase.commands";
import { CommentQuery } from "./usecases/comments/comment.usecase.queries";

@Module({
  controllers: [CommentController],
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  providers: [CommentRepository, CommentCommands, CommentQuery],
})
export class CommentModule {}
