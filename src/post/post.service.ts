import { Body, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto } from "./dto";
import * as fs from 'fs';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {
  }


  async getAllPosts() {
    return await this.prisma.post.findMany({
      where: {

      }
    });
  }

  async getPostsById(postId: string) {
    return await this.prisma.post.findFirst({
      where: {
        id: postId,
        isPublished: true
      }
    });
  }


  async createPost(postId: string, userId: number, dto: CreatePostDto, thumbnailUrl?: string) {
    //TODO: add uuid to slug

    try {
      return await this.prisma.post.create({
        data: {
          id: postId,
          authorId: userId,
          thumbnail: thumbnailUrl,
          ...dto
        }
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async updatePost(userId: number, postId: string, dto: UpdatePostDto, thumbnailUrl?: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    });
    if (!post || post.authorId !== userId) throw new ForbiddenException("Access to resources denied.");

    return this.prisma.post.update({
      where: {
        id: postId
      },
      data: {
        thumbnail: thumbnailUrl,
        title: dto.title,
        content: dto.content,
        isPublished: dto.isPublished,

      }
    });
  }

  async deletePost(userId: number, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    });
    if (!post || post.authorId !== userId) throw new ForbiddenException("Access to resources denied.");

    await this.prisma.post.delete({
      where: {
        id: postId
      }
    });
  }

  async deletePostThumbnail(userId: number, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    });
    if (!post || post.authorId !== userId) throw new ForbiddenException("Access to resources denied.");

    return await this.prisma.post.update({
      where: {
        id: postId
      },
      data: {
        thumbnail: null
      }
    });
  }

  async removeThumbnailFile( userId: number,postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post || post.authorId !== userId) throw new ForbiddenException("Access to resources denied.");
    const filename = post.thumbnail.split("/")[3];
    const path = `./public/thumbnails/${filename}.jpg`
      fs.unlink(path, function(err) { if (err) return console.log(err); console.log("File deleted successfully"); });
  }
}
