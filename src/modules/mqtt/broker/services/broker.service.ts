import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
} from '@nestjs/common';
import aedes from 'aedes';
import { Aedes, Client, ConnectPacket } from 'aedes';
import { createServer } from 'aedes-server-factory';
import { protocolDecoder } from 'aedes-protocol-decoder';
import { AuthService } from './auth.service';

@Injectable()
export class BrokerService implements OnModuleInit, OnApplicationBootstrap {
  private aedesInstance: Aedes;

  constructor(private authService: AuthService) {}

  onModuleInit() {
    this.aedesInstance = aedes({
      preConnect: (
        client: Client,
        packet: ConnectPacket,
        callback: (error: Error | null, success: boolean) => void,
      ) => {
        // if (client.connDetails && client.connDetails.ipAddress) {
        //   client.ip = client.connDetails.ipAddress.split(':')[3];
        // }
        // client.eventAt = new Date();
        // console.log(client);
        callback(null, true);
      },
      authenticate: this.authService.connectAuth,
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
