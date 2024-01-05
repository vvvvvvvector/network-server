import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';

import { EncapsulatedJwtModule } from 'src/auth/modules/jwt.module';

@Module({
  imports: [UsersModule, PassportModule, ProfilesModule, EncapsulatedJwtModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
