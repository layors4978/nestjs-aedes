import { Module } from '@nestjs/common';
import { BrokerService } from './services/broker.service';
import { AuthService } from './services/auth.service';

const modules = [BrokerService, AuthService];

@Module({
  providers: modules,
  exports: modules,
})
export class BrokerModule {}
