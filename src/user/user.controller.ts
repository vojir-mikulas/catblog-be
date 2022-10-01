import { Body, Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {User} from '@prisma/client'
import { GetUser } from "../auth/decorator";

@Controller('users')
export class UserController{
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyAccount(@GetUser() user: User ){
    return user
  }
}