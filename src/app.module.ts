import { Module } from '@nestjs/common';
import { BrokerModule } from './modules/mqtt/broker/broker.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [BrokerModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
