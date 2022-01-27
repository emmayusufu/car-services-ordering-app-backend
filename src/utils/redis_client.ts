import { createClient } from 'redis';
import { logger } from './logger';

const redisClient = createClient({ url: 'redis://@host.docker.internal:6378' });

redisClient.on('error', (err) => {
    if (err instanceof Error) {
        logger.error('Redis Client Error', err.message);
    }
    logger.error('Redis Client Error', err);
});

async () => {
    await redisClient.connect();

    await redisClient.flushAll();
};

export { redisClient };
