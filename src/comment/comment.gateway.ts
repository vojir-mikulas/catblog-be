import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { CommentDto } from "./dto";
import { BadRequestException, Body, ForbiddenException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorator";
import { CommentService } from "./comment.service";
import { WsGuard } from "../auth/guard/ws.guard";

@WebSocketGateway(3002,{cors:'*'})
export class CommentGateway{
  constructor(private commentService : CommentService) {
  }

  @WebSocketServer()
  server;

  @UseGuards(WsGuard)
  @SubscribeMessage('comment')
  async handleComment(@Body() dto:any){

    if(dto.method === 'delete'){
      if(!dto || !dto.id) throw new WsException('Invalid credentials.');
      await this.commentService.deleteComment(dto.user.id, dto)
      const allComments = await this.commentService.getAllRelatedComments(dto)
      this.server.emit('comment',allComments)
    }else if(dto.method === 'post'){
      if(!dto || !dto.content) throw new WsException('Invalid credentials.');
      await this.commentService.createComment(dto.user.id, dto)
      const allComments = await this.commentService.getAllRelatedComments(dto)
      this.server.emit('comment',allComments)
    } else if (dto.method === 'put'){
      await this.commentService.Upvote(dto.user.id,dto)
      const allComments = await this.commentService.getAllRelatedComments(dto)
      this.server.emit('comment',allComments)
    }


  }


}