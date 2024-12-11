import { createClient, RedisClientType } from 'redis';

// Singleton client for Redis
let client: RedisClientType | null = null;

export const getRedisClient = (): RedisClientType => {
  if (client) {
    return client;
  }

  // Initialize the Redis client (with URL or default connection)
  client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  client.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  client.connect();
  return client;
};