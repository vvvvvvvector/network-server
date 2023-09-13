import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRequsetDto {
  @IsNotEmpty()
  @ApiProperty()
  username: string;
}
