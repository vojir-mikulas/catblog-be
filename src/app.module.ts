import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AppController } from "./app.controller";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { CommentModule } from './comment/comment.module';


@Module({
  imports: [ ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, PostModule, PrismaModule, CommentModule],
  controllers: [AppController]
})
export class AppModule {
}
