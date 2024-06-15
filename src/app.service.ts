import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World le van manh 20012000';
  
  }
  getselectAPI(): number{
    let a: number = 5;

    return a
  }

}
