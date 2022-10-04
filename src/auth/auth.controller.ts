import { Body, Controller, HttpCode, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, TokenDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  //TODO: Complete swagger doc
  @ApiOperation({description: "The user registration endpoint"})
  // Request Documentation
  @ApiBody({
    type: AuthDto,
    examples: {
      a: {
        summary: "Register body #1",
        value: {
          name: "Tomáš",
          surname: "Vostárek",
          email: "tomas.vostarek@gmail.com",
          password: "123"
        } as AuthDto
      },
      b: {
        summary: "Register body #2",
        value: {
          name: "Libor",
          surname: "Fiala",
          email: "libor.fiala@gmail.com",
          password: "123"
        } as AuthDto
      }
    }

  })
  @Post("register")
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post('token')
  @HttpCode(200)
  refreshAccessToken(@GetUser() user){
    const dto: TokenDto = {
      refreshToken: user.refreshToken
    }
    return this.authService.refreshAccessToken(dto.refreshToken)
  }
}