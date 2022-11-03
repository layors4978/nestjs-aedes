import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
} from '@nestjs/common';
import aedes from 'aedes';
import { Aedes, ConnectPacket } from 'aedes';
import { createServer } from 'aedes-server-factory';
import { protocolDecoder } from 'aedes-protocol-decoder';
import { AuthService } from './auth.service';
import { IpClient } from '../types/aedes.types';

@Injectable()
export class BrokerService implements OnModuleInit, OnApplicationBootstrap {
  private aedesInstance: Aedes;

  constructor(private authService: AuthService) {}

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
    // console.log(this.aedesInstance.handle);
  }
}
