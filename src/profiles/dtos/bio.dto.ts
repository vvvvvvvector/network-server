import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class UpdateBioDto {
  @ApiProperty({ default: 'hello world!' })
  @MaxLength(40)
  bio: string;
}
