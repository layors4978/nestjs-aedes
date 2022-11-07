import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

const connectConfig = {
  host: '127.0.0.1',
  port: 6379,
  database: 0,
};

@Injectable()
export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.startRedis();
  }

  async startRedis() {
    this.client = createClient(connectConfig);
    await this.client.connect();
    await this.client.HSET('username', 'myuser', 'qwerasdf');
    console.log('redis connected');
  }

  getRedisClient() {
    return this.client;
  }
}
