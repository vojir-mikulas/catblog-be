
import { Injectable, CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Observable } from 'rxjs';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class WsGuard implements CanActivate {
  constructor(private config: ConfigService, private prisma: PrismaService,@Inject(JwtService) private jwt: JwtService) {
  }
  async canActivate(
    context: ExecutionContext,
  ) {
    const req = context.switchToWs().getClient();
    const reqData = context.switchToWs().getData();


    const access_token = req.handshake.headers.authorization.split(' ')[1]

      try{
        const verifiedToken = await this.jwt.verifyAsync(access_token,{
          secret: this.config.get('JWT_ACCESS_SECRET')
        })
        reqData.user = await this.prisma.user.findUnique({
          where:{
            id: verifiedToken.sub
          }
        })
        if(!reqData.user) return false;

      }catch{
        return false
      }

     return true
  }
}
