import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({ default: 'helloworld' })
  username: string;

  @ApiProperty({ default: 'helloworld' })
  password: string;
}

export class SignUpUserDto {
  @ApiProperty({ default: 'helloworld' })
  username: string;

  @ApiProperty({ default: 'helloworld@gmail.com' })
  email: string;

  @ApiProperty({ default: 'helloworld' })
  password: string;
}
