import {IsEmail,IsNotEmpty,IsString} from "class-validator";

export class AuthDto{
  @IsString()
  @IsNotEmpty()
  name:string
  @IsString()
  @IsNotEmpty()
  surname:string
  @IsEmail()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}