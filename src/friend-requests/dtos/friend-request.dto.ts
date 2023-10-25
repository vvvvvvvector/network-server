import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class FriendRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
