import { Injectable, UploadedFile } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetUser } from "../auth/decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {
  }
  async getAllUsersPosts(userId: number) {
    return await this.prisma.post.findMany(
      {
        where: {
          authorId: userId
        },
        orderBy:{
          createdAt: 'desc'
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
          comments: true
        }
      }
    );
  }

  async getUsersPostById(userId: number, postId : string){
    return await this.prisma.post.findFirst({
      where:{
        id: postId,
        authorId: userId
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
        comments: true
      }
    })
  }

  async updateUser(userId:number, dto: UpdateUserDto){
  await this.prisma.user.update({
      where:{
        id:userId
      },
    data:{
        ...dto
    }
    })
  }
  async uploadAvatar( userId: number, file: Express.Multer.File){
    await this.prisma.user.update({
    where:{
      id:userId
    },
    data:{
      // @ts-ignore
      avatar: `${file.destination.substring(1)}/${file.filename}`
    }
  })
  }

  async deleteAvatar(userId: number){
    await this.prisma.user.update({
      where:{
        id:userId
      },
      data:{
        // @ts-ignore
        avatar: null
      }
    })
  }
}
