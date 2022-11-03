import { Module } from '@nestjs/common';
import { BrokerModule } from './modules/mqtt/broker/broker.module';

@Module({
  imports: [BrokerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
