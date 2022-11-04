import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

const connectConfig = {
  host: '127.0.0.1',
  port: 6379,
  database: 0,
};

@Injectable()
export class RedisService implements OnModuleInit {
  private client;

  onModuleInit() {
    this.client = createClient(connectConfig);
    this.client.connect();
    this.client.HSET('username', 'myuser', 'qwerasdf');
    console.log('redis connected');
  }

  getRedisClient() {
    return this.client;
  }
}
