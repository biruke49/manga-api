import { BaseRepository } from "@libs/common/repositories/base.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";

@Injectable()
export class CommentRepository extends BaseRepository<CommentEntity> {
  constructor(
    @InjectRepository(CommentEntity)
    commentRepository: Repository<CommentEntity>
  ) {
    super(commentRepository);
  }
}
