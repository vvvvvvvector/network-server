import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';

import { ROUTES, SWAGGER_API_TAGS } from 'src/utils/constants';

@Controller(ROUTES.MESSAGES)
@ApiTags(SWAGGER_API_TAGS.MESSAGES)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
}
