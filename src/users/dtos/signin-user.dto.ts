import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({ default: 'vector' })
  username: string;

  @ApiProperty({ default: 'helloworld' })
  password: string;
}
