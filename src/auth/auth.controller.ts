import { Body, Controller, HttpCode, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, TokenDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }
  @ApiOperation({description: "The user registration endpoint"})
  // Request Documentation

  @Post("register")
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('token')
  @HttpCode(200)
  refreshAccessToken(@Body() dto: TokenDto){
    return this.authService.refreshAccessToken(dto.refreshToken)
  }
}