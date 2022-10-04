import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto{
  @ApiProperty({
    type: String,
    description: "Title of post"
  })
  @IsString()
  @IsNotEmpty()
  title: string
  @ApiProperty({
    type: String,
    description: "Whetever is post published"
  })
  @IsOptional()
  isPublished?: boolean
  @ApiProperty({
    type: String,
    description: "Content of post"
  })
  @IsString()
  @IsNotEmpty()
  content: string

}