import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({ default: 'helloworld' })
  username: string;

  @ApiProperty({ default: 'helloworld' })
  password: string;
}
