import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get<string>('REDIS_URL') || 'redis:6379',
    });

    this.client.on('error', (err) => console.error('Redis Error:', err));
    this.client.connect();
  }

  async setKey(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async getKey(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async deleteKey(key: string): Promise<void> {
    console.log(`Deleting key: ${key}`);
    await this.client.del(key);
  }
}
