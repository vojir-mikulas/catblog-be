import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }
  async getAllUsersPosts(userId: number) {
    return await this.prisma.post.findMany(
      {
        where: {
          authorId: userId
        }
      }
    );
  }

  async getUsersPostById(userId: number, postId : string){
    return await this.prisma.post.findFirst({
      where:{
        id: postId,
        authorId: userId
      }
    })
  }
}
