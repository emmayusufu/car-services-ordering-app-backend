import { createClient } from 'redis';
import { logger } from './logger';

const redisClient = createClient();

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

await redisClient.connect();

await redisClient.flushAll();

export { redisClient };
