import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "@comments/models/comments/comment.entity";
import { CommentResponse } from "./comment.response";

@Injectable()
export class CommentQuery {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>
  ) {}

  async getCommentsByManga(mangaId: string): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.find({
      where: { mangaId },
      order: { createdAt: "DESC" },
    });
    return comments.map((entity) => CommentResponse.fromEntity(entity));
  }

  async getMyComments(userId: string): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return comments.map((entity) => CommentResponse.fromEntity(entity));
  }
}
