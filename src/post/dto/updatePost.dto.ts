import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePostDto{
  @IsString()
  @IsOptional()
  title?: string
  @IsOptional()
  thumbnail?: string
  @IsOptional()
  isPublished?: boolean
  @IsString()
  @IsOptional()
  content?: string
}