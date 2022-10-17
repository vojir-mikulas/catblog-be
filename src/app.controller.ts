import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller('')
export class AppController {

  @ApiOperation({description: "Ping API"})
  @Get("/")
  async getPostById() {
    return { message:'pong' }
  }
}
