import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto } from "./dto";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {
  }

  convertToSlugID(title: string) : string{
    return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLowerCase();
  }

  async getAllPosts() {
    return await this.prisma.post.findMany({
      where: {
        isPublished: true
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


  async createPost(userId: number, dto: CreatePostDto) {
    //TODO: add uuid to slug
    const id: string = this.convertToSlugID(dto.title)
    return await this.prisma.post.create({
      data:{
        id:id,
        title: dto.title,
        thumbnail: dto.thumbnail,
        isPublished: dto.isPublished,
        content: dto.content,
        authorId: userId
      }
    });
  }

  async updatePost(userId: number,postId : string, dto: UpdatePostDto){
    const post = await this.prisma.post.findUnique({
      where:{
        id:postId
      }
    })
    if(!post || post.authorId !== userId) throw new ForbiddenException('Access to resources denied.')

    return this.prisma.post.update({
      where:{
        id: postId,
      },
      data:{
        ...dto
      }
    })
  }

  async deletePost(userId: number,postId : string){
    const post = await this.prisma.post.findUnique({
      where:{
        id:postId
      }
    })
    if(!post || post.authorId !== userId) throw new ForbiddenException('Access to resources denied.')

    await this.prisma.post.delete({
      where:{
        id: postId
      }
    })
  }
}
