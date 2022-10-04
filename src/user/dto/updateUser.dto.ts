import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto{
  @ApiProperty({
    type: String,
    description: "Name"
  })
  @IsString()
  @IsOptional()
  name?: string
  @ApiProperty({
    type: String,
    description: "Surname"
  })
  @IsString()
  @IsOptional()
  surname?: string
  @ApiProperty({
    type: String,
    description: "Email"
  })
  @IsEmail()
  @IsOptional()
  email?: string

}