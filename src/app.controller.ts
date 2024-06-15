import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { response } from 'express';

@Controller('cat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/cat_hello')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/cats')
  findAll(): number {
  
    return this.appService.getselectAPI()
  }
  @Get('/cats/hehe')
  getuser(): string {
  
    return this.appService.getHello()
  }
}
