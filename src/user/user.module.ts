import { Module, UseGuards } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MulterModule } from "@nestjs/platform-express";


@Module({
  imports: [MulterModule.register({
    dest: "./public/avatar"
  })],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
}
