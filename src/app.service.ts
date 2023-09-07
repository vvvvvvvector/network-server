import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `[${process.env.DEVELOPER_USERNAME}] network-server app is running...`;
  }
}
