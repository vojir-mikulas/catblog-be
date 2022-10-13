import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentGateway } from "./comment.gateway";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [CommentService,CommentGateway],
  imports: [JwtModule]
})
export class CommentModule {}
