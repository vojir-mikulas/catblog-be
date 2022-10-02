import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePostDto{
  @IsString()
  @IsNotEmpty()
  title: string
  @IsOptional()
  thumbnail?: string
  @IsOptional()
  isPublished?: boolean
  @IsString()
  @IsNotEmpty()
  content: string
}