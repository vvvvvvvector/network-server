import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

import { SWAGGER_API_TAGS } from './utils/constants';

@ApiTags(SWAGGER_API_TAGS.ROOT)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary:
      'Endpoint for testing an environment variable [DEVELOPER_USERNAME]',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
