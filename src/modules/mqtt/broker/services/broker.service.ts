import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
} from '@nestjs/common';
import aedes from 'aedes';
import { Aedes, ConnectPacket } from 'aedes';
import { createServer } from 'aedes-server-factory';
import { protocolDecoder } from 'aedes-protocol-decoder';
import RedisPersistence from 'aedes-persistence-redis';
import { IpClient } from '../types/aedes.types';
import { AuthService } from './auth.service';
import { RedisService } from 'src/modules/common/services/redis/redis.service';

@Injectable()
export class BrokerService implements OnModuleInit, OnApplicationBootstrap {
  private aedesInstance: Aedes;

  constructor(
    private redisService: RedisService,
    private authService: AuthService,
  ) {}

  onModuleInit() {
    this.aedesInstance = aedes({
      preConnect: (
        client: IpClient,
        packet: ConnectPacket,
        callback: (error: Error | null, success: boolean) => void,
      ) => {
        if (client.connDetails && client.connDetails.ipAddress) {
          client.ip = client.connDetails.ipAddress.split(':')[3];
        }
        client.eventAt = new Date();
        callback(null, true);
      },
      persistence: RedisPersistence({
        port: 6379,
        host: '127.0.0.1',
        // family: 4, // 4 (IPv4) or 6 (IPv6)
        db: 15,
      }),
      authenticate: this.authService.connectAuth,
      authorizePublish: this.authService.publishAuth,
      authorizeSubscribe: this.authService.subscribeAuth,
    });
  }

  onApplicationBootstrap() {
    createServer(this.aedesInstance, {
      trustProxy: true,
      protocolDecoder,
    }).listen(1883, () => {
      console.log('MQTT Broker is listening on port 1883');
    });
    // console.log(this.aedesInstance);
    // this.aedesInstance.on('client', (client: IpClient) => {
    //   console.log(client.ip + ' connected');
    // });
    this.aedesInstance.on('publish', async (packet, client) => {
      if (client && /^\$/.test(packet.topic)) {
        const payload = JSON.parse(packet.payload.toString());
        // console.log(payload);
        // const result = Object.keys(payload).map((key) => {
        //   return [key, payload.key];
        // });
        await this.redisService.getRedisClient().HSET(packet.topic, payload);
      }
    });
  }

  getAedesInstance(): Aedes {
    return this.aedesInstance;
  }
}
