import { Injectable } from '@nestjs/common';
import { AuthenticateError, PublishPacket, Subscription } from 'aedes';
import { IpClient } from '../types/aedes.types';
import { RedisService } from 'src/modules/common/services/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(private redisService: RedisService) {}

  async connectAuth(
    client: IpClient,
    username: string,
    password: Buffer,
    callback: (error: AuthenticateError | null, success: boolean) => void,
  ) {
    // console.log(this.redisService.getRedisClient().hKeys);

    // if (
    //   !username ||
    //   !(await this.redisService.getRedisClient().HEXISTS('username', username))
    //   // ||
    //   // (await this.redisService.getRedisClient().HGET('username', username)) !==
    //   //   password.toString()
    // ) {
    //   callback(null, false);
    // }

    callback(null, true);
  }

  publishAuth(
    client: IpClient,
    packet: PublishPacket,
    callback: (error?: Error | null) => void,
  ) {
    if (packet.topic.startsWith('$SYS')) {
      console.log('no $SYS');
      return callback(new Error('$SYS prefix topic is reserved'));
    }
    // if (packet.topic === '$thing/DEMO0002/$cmd/2') {
    //   packet.payload = Buffer.from('overwrite packet payload');
    // }
    // console.log(packet);
    callback(null);
  }

  subscribeAuth(
    client: IpClient,
    subscription: Subscription,
    callback: (error: Error | null, subscription?: Subscription | null) => void,
  ) {
    if (subscription.topic === '$thing/DEMO0002/$cmd/1') {
      return callback(new Error('wrong topic'));
    }
    if (subscription.topic === '$thing/DEMO0002/$cmd/2') {
      callback(null, subscription);
    }
    console.log(subscription);
  }
}
