import 'reflect-metadata';
import dotenv from 'dotenv';
import { server } from './app';
import { createConnection } from 'typeorm';
import { logger } from './utils/logger';
dotenv.config();

const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';

await createConnection();
server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} =======`);
    logger.info(`App listening on the port http://localhost:${port}`);
    logger.info(`=================================`);
});
