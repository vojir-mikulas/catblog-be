import {
  Body,
  Controller,
  Delete,
  Get, NotFoundException,
  Param,
  Post, Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/decorator";
import { UserService } from "./user.service";
import { FileInterceptor, MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Request } from "express";
import * as fs from "fs";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { ApiOperation } from "@nestjs/swagger";

type User = {
  id: number
  name: string
  surname: string
  email: string
  refreshToken: string | null
  password: string
  avatar: string | null
}


@Controller("users")
export class UserController {
  constructor(private userService: UserService) {
  }

  @ApiOperation({description: "Current user verified with token"})
  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMyAccount(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({description: "Edit user credentials / upload avatar"})
  @UseGuards(AuthGuard("jwt"))
  @Put()
  updateUser(@GetUser("id") userId: number, @Body() dto: UpdateUserDto){
  return this.userService.updateUser(userId,dto)
  }


  @ApiOperation({description: "Get all users posts"})
  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Get("posts")
  getAllUsersPosts(@GetUser("id") userId: number) {
    return this.userService.getAllUsersPosts(userId);
  }


  @ApiOperation({description: "Get single users post by id"})
  //PROTECTED
  @UseGuards(AuthGuard("jwt"))
  @Get("posts/:id")
  async getUsersPostById(@GetUser("id") userId: number, @Param("id") postId: string) {
    const post = await this.userService.getUsersPostById(userId, postId);

    if(!post) throw new NotFoundException()
    return post
  }

  @ApiOperation({description: "Upload user avatar"})
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
    console.log(file)
    return this.userService.uploadAvatar(userId, file);
  }

  @ApiOperation({description: "Delete user avatar"})
  //DELETE USER AVATAR
  @UseGuards(AuthGuard("jwt"))
  @Delete("avatar")
  async removeAvatar(@GetUser("id") userId: number,) {
    fs.unlink(`./public/avatar/${userId}.jpg`,function(err){
      if(err) return console.log(err);
      console.log('File deleted successfully');
    })
    return this.userService.deleteAvatar(userId);
  }
}