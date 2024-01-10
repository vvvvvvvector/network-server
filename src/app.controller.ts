import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

import { SWAGGER_API_TAGS } from './utils/constants';

@ApiTags(SWAGGER_API_TAGS.ROOT)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root() {
    return 'Social Network Server is running...';
  }
}
