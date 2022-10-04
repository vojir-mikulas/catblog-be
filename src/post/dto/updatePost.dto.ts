import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostDto{
  @ApiProperty({
    type: String,
    description: "Post title"
  })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({
    type: String,
    description: "Filename"
  })
  @IsOptional()
  @IsString()
  filename?: string

  @ApiProperty({
    type: String,
    description: "Password"
  })

  @ApiProperty({
    type: String,
    description: "If is post published"
  })
  @IsOptional()
  isPublished?: boolean

  @ApiProperty({
    type: String,
    description: "Content of post"
  })
  @IsString()
  @IsOptional()
  content?: string
}