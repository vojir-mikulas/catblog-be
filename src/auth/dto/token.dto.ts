import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TokenDto{
  @ApiProperty({
    type: String,
    description: "Refresh token"
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}