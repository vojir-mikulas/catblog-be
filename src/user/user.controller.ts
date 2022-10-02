import { Body, Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {User} from '@prisma/client'
import { GetUser } from "../auth/decorator";
import { UserService } from "./user.service";

@Controller('users')
export class UserController{
  constructor(private userService : UserService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyAccount(@GetUser() user: User ){
    return user
  }

  //PROTECTED
  @UseGuards(AuthGuard('jwt'))
  @Get('posts')
  getAllUsersPosts(@GetUser('id') userId: number) {
    return this.userService.getAllUsersPosts(userId);
  }

  //PROTECTED
  @UseGuards(AuthGuard('jwt'))
  @Get('posts/:id')
  getUsersPostById(@GetUser('id') userId: number,@Param('id') postId: string) {
    return this.userService.getUsersPostById(userId, postId);
  }
}