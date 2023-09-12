import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestsRepository: Repository<FriendRequest>,
  ) {}

  friendsList() {
    return ['friend1', 'friend2', 'friend3'];
  }

  create() {
    return 'create';
  }

  accept() {
    return 'accepted';
  }

  reject() {
    return 'rejected';
  }
}
