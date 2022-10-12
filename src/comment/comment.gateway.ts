import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { CommentDto } from "./dto";
import { BadRequestException, Body, ForbiddenException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorator";
import { CommentService } from "./comment.service";

@WebSocketGateway(3002,{cors:'*'})
export class CommentGateway{
  constructor(private commentService : CommentService) {
  }

  @WebSocketServer()
  server;


  @SubscribeMessage('comment')
  async handleComment(@Body() dto :any){
    console.log(dto)
    if(dto.method === 'delete'){
      if(!dto || !dto.id) throw new WsException('Invalid credentials.');
      await this.commentService.deleteComment(1, dto)
      const allComments = await this.commentService.getAllRelatedComments(dto)
      this.server.emit('comment',allComments)
    }else if(dto.method === 'post'){
      if(!dto || !dto.content) throw new WsException('Invalid credentials.');
      await this.commentService.createComment(1, dto)
      const allComments = await this.commentService.getAllRelatedComments(dto)
      this.server.emit('comment',allComments)
    } else if (dto.method === 'put'){
      await this.commentService.Upvote(1,dto)
      const allComments = await this.commentService.getAllRelatedComments(dto)
      this.server.emit('comment',allComments)
    }


  }


}