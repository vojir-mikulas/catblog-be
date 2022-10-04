import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto{
  @ApiProperty({
    type: String,
    description: "Email"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string
  @ApiProperty({
    type: String,
    description: "Password"
  })
  @IsString()
  @IsNotEmpty()
  password: string
}