import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class AcceptFriendRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
