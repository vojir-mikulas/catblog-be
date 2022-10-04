import {
  Body,
  Controller,
  Delete,
  Get, NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { PostService } from "./post.service";
import { GetUser } from "../auth/decorator";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma.service";
import {v4 as uuid} from 'uuid'

@Controller("posts")
export class PostController {
  constructor(private postService: PostService, private prismaService: PrismaService) {
  }

  convertToSlugID(title: string): string {
    return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").toLowerCase() + uuid();
  }

  //PUBLIC
  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  //PUBLIC
  @Get(":id")
  async getPostById(@Param("id") postId: string) {
    const post = await this.postService.getPostsById(postId);
     if(!post) throw new NotFoundException()
    return post
  }


  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Post()
  @UseInterceptors(FileInterceptor("thumbnail", {
    storage: diskStorage({
      destination: "./public/thumbnails",
      filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {

        const filename = `${uuid()}.jpg`;
        callback(null, filename);
      }
    })
  }))
  createPost(@GetUser("id") userId: number, @Body() dto: CreatePostDto, @UploadedFile() file: Express.Multer.File) {
    const postId: string = this.convertToSlugID(dto.title);
    let filepath: string;
    if(file) filepath = `${file.destination.substring(1)}/${file.filename}`;
    return this.postService.createPost(postId, userId, dto, filepath);
  }

  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Put(":id")
  @UseInterceptors(FileInterceptor("thumbnail", {
    storage: diskStorage({
      destination: "./public/thumbnails",
      filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {

        let filename = undefined;
        // TODO: fix the req.body issue
        // req.body is always [Object: null prototype] not containing the needed filename for replacing thumbnail file
        if(!req.body['filename']) {
          filename = `${uuid()}.jpg`;
        }
        else {
          filename = `${req.body["filename"]}`;
        }

        callback(null, filename);
      }
    })
  }))
  updatePost(@GetUser("id") userId: number, @Param("id") postId: string, @Body() dto: UpdatePostDto, @UploadedFile() file: Express.Multer.File) {
    let filepath: string = null;
    console.log(dto)
    if(file) {
       filepath = `${file.destination.substring(1)}/${file.filename}`;
    }
    dto.isPublished = Boolean(dto.isPublished);
    return this.postService.updatePost(userId, postId, dto, filepath);
  }

  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async deletePost(@GetUser("id") userId: number, @Param("id") postId: string) {
    await this.postService.removeThumbnailFile(userId,postId)
    return this.postService.deletePost(userId, postId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("tumbnail/:id")
  async deletePostTumbnail(@GetUser("id") userId: number, @Param("id") postId: string){
    await this.postService.removeThumbnailFile(userId,postId)
    return this.postService.deletePostThumbnail(userId, postId);
  }


}