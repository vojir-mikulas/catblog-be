import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { access } from "fs";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {
  }

  async register(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          surname: dto.surname,
          email: dto.email,
          password: hash
        }
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Email is already taken");
        }
      }
    }
  }

  async login(dto: LoginDto) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });
    if (!user) throw new ForbiddenException("Email address or password incorrect");

    let pwIsCorrrect = await argon.verify(user.password, dto.password);
    if (!pwIsCorrrect) throw new ForbiddenException("Email address or password incorrect");

    return this.signToken(user.id, user.email)
  }

  async signToken(userId: number, email: string) : Promise<{access_token: string}>{
    const data = {
      sub: userId,
      email
    };

    let token = await this.jwt.signAsync(data, {
      expiresIn: "20m",
      secret: this.config.get('JWT_SECRET_KEY')
    });
    return {
      access_token: token
    }
  }
}