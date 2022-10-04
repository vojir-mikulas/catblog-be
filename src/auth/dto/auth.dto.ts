import {IsEmail,IsNotEmpty,IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto{
  @ApiProperty({
    type: String,
    description: "Name"
  })
  @IsString()
  @IsNotEmpty()
  name:string
  @ApiProperty({
    type: String,
    description: "Surname"
  })
  @IsString()
  @IsNotEmpty()
  surname:string
  @ApiProperty({
    type: String,
    description: "Email"
  })
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: "The target subreddit"
  })
  email: string
  @ApiProperty({
    type: String,
    description: "Password"
  })
  @IsString()
  @IsNotEmpty()
  password: string
}