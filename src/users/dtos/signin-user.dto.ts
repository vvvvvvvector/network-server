import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({ default: 'vector' })
  username: string;

  @ApiProperty({ default: 'helloworld123' })
  password: string;
}
