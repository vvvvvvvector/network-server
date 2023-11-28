import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class InitiateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  addresseeUsername: string;
}
