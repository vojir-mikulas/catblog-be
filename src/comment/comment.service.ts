import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CommentDto } from "./dto";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {
  }

  async getAllRelatedComments(dto: CommentDto) {
    // @ts-ignore
    const upvotes: Array<any> = await this.prisma.upvote.groupBy({
      by: ["commentId"],
      _sum: {
        // @ts-ignore
        value: true
      }

    });

    const comments = await this.prisma.comment.findMany({
      where: {
        postId: dto.postId
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const arr = comments.map((comment: any) => {
      comment.upvotes = 0;
      upvotes.forEach((upvote: any) => {
        if (comment.id === upvote.commentId) {
          comment.upvotes = upvote._sum.value;
        }
      });
      console.log(comment)
      return comment;
    });

    return arr;
  }

  async createComment(userId, dto: CommentDto) {
    await this.prisma.comment.create({
      data: {
        userId,
        content: dto.content,
        postId: dto.postId,
        parentId: dto.parentId ? dto.parentId : undefined
      }
    });
  }

  async deleteComment(userId: any, dto: CommentDto) {

    const comment = await this.prisma.comment.findUnique({
      where: {
        id: dto.id
      }
    });
    if (comment.userId !== userId) throw new WsException("Access denied");

    await this.prisma.comment.delete({
      where: {
        id: dto.id
      }
    });
  }

  async Upvote(userId: any, dto: any) {
    const upvote: any = await this.prisma.upvote.findUnique({
      where: {
        userId_commentId: {
          commentId: dto.id,
          userId
        }
      }
    });
    if (!upvote) {
      return await this.prisma.upvote.create({
        data: {
          userId,
          commentId: dto.id,
          // @ts-ignore
          value: dto.value
        }
      });
    }

    if (upvote.value === dto.value) {
      return await this.prisma.upvote.delete({
        where: {
          userId_commentId: {
            commentId: dto.id,
            userId
          }
        }
      });
    } else {
      return await this.prisma.upvote.update({
        where: {
          userId_commentId: {
            commentId: dto.id,
            userId
          }
        },
        data: {
          // @ts-ignore
          value: (dto.value === 1 ? 1 : (-1))
        }
      });
    }

  }

}
