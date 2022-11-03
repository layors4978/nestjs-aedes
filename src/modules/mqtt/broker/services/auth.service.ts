import { Injectable } from '@nestjs/common';
import { AuthenticateError, PublishPacket, Subscription } from 'aedes';
import { IpClient } from '../types/aedes.types';

@Injectable()
export class AuthService {
  connectAuth(
    client: IpClient,
    username: string,
    password: Buffer,
    callback: (error: AuthenticateError | null, success: boolean) => void,
  ) {
    // console.log({
    //   id: client.id,
    //   username,
    //   password: password.toString(),
    // });
    const whitelist = ['device:DEMO0001', 'device:DEMO0002'];
    if (!whitelist.includes(client.id)) {
      callback(null, false);
    }
    // console.log('connecting');
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
    if (packet.topic === '$thing/DEMO0002/$cmd/2') {
      packet.payload = Buffer.from('overwrite packet payload');
      console.log(packet);
    }
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
      callback(null, null);
    }
    console.log(subscription);
  }
}
