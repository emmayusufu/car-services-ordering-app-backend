import 'reflect-metadata';
import http from 'http';
import dotenv from 'dotenv';
import { app } from './app';
import { createConnection } from 'typeorm';
import { logger } from './utils/logger';
import { setIO, socketIOController, getIO } from './utils/socket_io';
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), 'env/.env'),
});

const port = process.env.PORT;
const env = process.env.NODE_ENV || 'development';
const server: http.Server = http.createServer(app);

setIO(server);

const io = getIO();

io.on('connection', socketIOController);

(async () => {
    let retries = 5;
    while (retries) {
        try {
            await createConnection();
            server.listen(port, () => {
                logger.info(`=================================`);
                logger.info(`======= ENV: ${env} =======`);
                logger.info(
                    `App listening on the port http://localhost:${port}`
                );
                logger.info(`=================================`);
            });

            break;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error);
            }
            retries -= 1;
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
})();
