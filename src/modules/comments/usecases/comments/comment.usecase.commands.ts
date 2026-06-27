import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentRepository } from "@comments/models/comments/comment.repository";
import { CreateCommentCommand, UpdateCommentCommand } from "./comment.commands";
import { CommentResponse } from "./comment.response";

@Injectable()
export class CommentCommands {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(command: CreateCommentCommand): Promise<CommentResponse> {
    const comment = await this.commentRepository.insert({
      userId: command.currentUser.id,
      mangaId: command.mangaId,
      chapterId: command.chapterId,
      content: command.content,
      parentId: command.parentId,
      createdBy: command.currentUser?.id,
    } as any);
    return CommentResponse.fromEntity(comment);
  }

  async updateComment(command: UpdateCommentCommand): Promise<CommentResponse> {
    const comment = await this.commentRepository.getById(command.id);
    if (!comment) throw new NotFoundException("Comment not found.");
    if (comment.userId !== command.currentUser.id) {
      throw new NotFoundException("Comment not found.");
    }
    comment.content = command.content;
    comment.updatedBy = command.currentUser?.id;
    const updated = await this.commentRepository.update(command.id, comment);
    return CommentResponse.fromEntity(updated);
  }

  async deleteComment(id: string, currentUser: { id: string }): Promise<boolean> {
    const comment = await this.commentRepository.getById(id);
    if (!comment) throw new NotFoundException("Comment not found.");
    if (comment.userId !== currentUser.id) {
      throw new NotFoundException("Comment not found.");
    }
    return this.commentRepository.delete(id);
  }
}
