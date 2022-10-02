import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { GetUser } from "../auth/decorator";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("posts")
export class PostController {
  constructor(private postService: PostService) {
  }

  //PUBLIC
  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  //PUBLIC
  @Get(":id")
  getPostById(@Param('id') postId: string) {
  return this.postService.getPostsById(postId)
  }




  //PROTECTED
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
  return this.postService.createPost(userId,dto)
  }

  //PROTECTED
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updatePost(@GetUser('id') userId: number,@Param('id') postId: string, @Body() dto: UpdatePostDto) {
  return this.postService.updatePost(userId,postId,dto)
  }

  //PROTECTED
  @UseGuards(AuthGuard('jwt'))
  @Delete(":id")
  deletePost(@GetUser('id') userId: number,@Param('id') postId: string) {
  return this.postService.deletePost(userId, postId)
  }
}
