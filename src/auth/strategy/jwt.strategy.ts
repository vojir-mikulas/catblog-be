import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy){
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET')
    });
  }
  async validate(payload: { sub:number, email: string }) {
    const user = await this.prisma.user.findUnique({
      where:{
        id:payload.sub
      }
    })
    delete user.password

    return user
  }
}

