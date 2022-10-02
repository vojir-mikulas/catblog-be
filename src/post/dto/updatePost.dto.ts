import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePostDto{
  @IsString()
  @IsOptional()
  title?: string
  @IsOptional()
  @IsString()
  filename?: string
  @IsOptional()
  isPublished?: boolean
  @IsString()
  @IsOptional()
  content?: string
}