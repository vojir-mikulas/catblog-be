import { Body, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto } from "./dto";
import * as fs from "fs";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {
  }


  async getAllPosts() {
    return await this.prisma.post.findMany({
      where: {
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        content: true,
        isPublished: true,
        author: {
          select: {
            name: true,
            surname: true,
            avatar: true
          }
        },
        _count: {
          select:{
            comments:true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getPostsById(postId: string) {

    // @ts-ignore
    const upvotes: Array<any> = await this.prisma.upvote.groupBy({
      by: ["commentId"],
      _sum: {
        // @ts-ignore
        value: true
      }

    });

    const post: any = await this.prisma.post.findFirst({
      where: {
        id: postId,
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        content: true,
        isPublished: true,
        author: {
          select: {
            name: true,
            surname: true,
            avatar: true
          }
        },
        comments: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: true

          }
        }
      }
    });


    post.comments = post?.comments.map((comment: any) => {
      comment.upvotes = 0;
      upvotes.forEach((upvote: any) => {
        if (comment.id === upvote.commentId) {
          comment.upvotes = upvote._sum.value;
        }
      });
      return comment;
    });
    return post;

  }

  async createPost(postId: string, userId: number, dto: CreatePostDto, thumbnailUrl?: string) {

    try {
      dto.isPublished = dto.isPublished === "true";

      return await this.prisma.post.create({
        // @ts-ignore
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

    let prevUrl = post.thumbnail ? post.thumbnail : undefined;
    let url = thumbnailUrl ? thumbnailUrl : prevUrl;
    if (dto.isPublished === true && !url) throw new ForbiddenException("Post must have an image before publishing.");
    return this.prisma.post.update({
      where: {
        id: postId
      },
      data: {
        title: dto.title,
        content: dto.content,
        // @ts-ignore
        isPublished: dto.isPublished,
        thumbnail: url
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

  async removeThumbnailFile(userId: number, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post || post.authorId !== userId) throw new ForbiddenException("Access to resources denied.");
    if (!post.thumbnail) return;
    const filename = post.thumbnail.split("/")[3];
    const path = `./public/thumbnails/${filename}`;
    fs.unlink(path, function(err) {
      if (err) return console.log(err);
      console.log("File deleted successfully");
    });
  }
}
