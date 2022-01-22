import 'reflect-metadata';
import http from 'http';
import dotenv from 'dotenv';
import { app } from './app';
import { createConnection } from 'typeorm';
import { logger } from './utils/logger';
import { setIO, socketIOController, getIO } from './utils/socket_io';
dotenv.config();

const port = process.env.PORT || 5000;
const env = process.env.NODE_ENV || 'development';
const server: http.Server = http.createServer(app);

setIO(server);

const io = getIO();

io.on('connection', socketIOController);

async () => {
    await createConnection();
};

server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} =======`);
    logger.info(`App listening on the port http://localhost:${port}`);
    logger.info(`=================================`);
});
