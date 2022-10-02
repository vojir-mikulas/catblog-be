import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { GetUser } from "../auth/decorator";
import { UserService } from "./user.service";
import { FileInterceptor, MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Request } from "express";
import { v4 as uuid } from "uuid";
import * as fs from "fs";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {
  }

  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMyAccount(@GetUser() user: User) {
    return user;
  }

  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Get("posts")
  getAllUsersPosts(@GetUser("id") userId: number) {
    return this.userService.getAllUsersPosts(userId);
  }

  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Get("posts/:id")
  getUsersPostById(@GetUser("id") userId: number, @Param("id") postId: string) {
    return this.userService.getUsersPostById(userId, postId);
  }

  // USER AVATAR
  @UseGuards(AuthGuard("jwt"))
  @Post("avatar")
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: "./public/avatar",
      filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        const filename = `${req.user["id"]}.jpg`;
        callback(null, filename);
      }
    })
  }))
  uploadAvatar(@GetUser("id") userId: number, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(userId, file);
  }
  //DELETE USER AVATAR
  @UseGuards(AuthGuard("jwt"))
  @Delete("avatar")
  async removeAvatar(@GetUser("id") userId: number,) {
    fs.unlink(`./public/avatar/${userId}.jpg`,function(err){
      if(err) return console.log(err);
      console.log('File deleted successfully');
    })
  }
}