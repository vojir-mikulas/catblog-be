import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentGateway } from "./comment.gateway";

@Module({
  providers: [CommentService,CommentGateway],
  controllers: [CommentController]
})
export class CommentModule {}
