import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDto {
  @ApiProperty({ default: 'newuser' })
  username: string;

  @ApiProperty({ default: 'newuser@gmail.com' })
  email: string;

  @ApiProperty({ default: 'helloworld123' })
  password: string;
}
