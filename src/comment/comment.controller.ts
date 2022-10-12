import { Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorator";
import { CommentService } from "./comment.service";

@Controller('posts/comment')
export class CommentController {
constructor(private commentService: CommentService) {
}

  @UseGuards(AuthGuard("jwt"))
  @Post(":id")
  async getComment(@GetUser("id") userId: number,@Param("id") postId: string) {

  }




}
