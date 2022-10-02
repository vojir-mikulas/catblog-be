import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

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

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string, refresh_token: string }> {
    const data = {
      sub: userId,
      email
    };

    let access_token = await this.jwt.signAsync(data, {
      expiresIn: this.config.get("JWT_ACCESS_EXP"),
      secret: this.config.get("JWT_ACCESS_SECRET")
    });
    let refresh_token = await this.jwt.signAsync(data, {
      expiresIn: this.config.get("JWT_REFRESH_EXP"),
      secret: this.config.get("JWT_REFRESH_SECRET")
    });

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        // @ts-ignore
        refreshToken: refresh_token
      }
    });

    return {
      access_token,
      refresh_token
    };
  }

  async refreshAccessToken(refresh_token: string) : Promise<{ access_token: string}> {
    try{
      this.jwt.verify(refresh_token, {secret: this.config.get("JWT_REFRESH_SECRET")})
    }catch(error){
      throw new ForbiddenException("Invalid refresh token");
    }
    const decodedJwtAccessToken =  this.jwt.decode(refresh_token);
    const user = await this.prisma.user.findUnique({ where: { id: decodedJwtAccessToken.sub} });
    if(user.refreshToken !== refresh_token) throw new ForbiddenException("Invalid refresh token");

    const data = {
      sub: user.id,
      email: user.email
    };
    let access_token = await this.jwt.signAsync(data, {
      expiresIn: this.config.get("JWT_ACCESS_EXP"),
      secret: this.config.get("JWT_ACCESS_SECRET")
    });
    return {
      access_token
    }
  }
}