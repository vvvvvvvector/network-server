import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { User } from './entities/user.entity';

import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';

// exports TypeOrmModule if i want to use repository outside of the module
// then if i import UsersModule in another module, i can use @InjectRepository(User)

@Module({
  imports: [
    forwardRef(() => FriendRequestsModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
