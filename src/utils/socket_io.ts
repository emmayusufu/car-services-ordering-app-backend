import { Server, Socket } from 'socket.io';
import http from 'http';
import { redisClient } from './redis_client';
import clc from 'cli-color';
import { logger } from './logger';
import { ServerToClientEvents, SocketAuth } from '../interfaces/interfaces';

let IO: Server<ServerToClientEvents> | null = null;

const setIO = (server: http.Server) => {
    IO = new Server(server, {
        cors: { origin: '*' },
    });
};

const getIO = (): Server | null => {
    return IO;
};

const socketIOController = async (socket: Socket) => {
    const auth = socket.handshake.auth as SocketAuth;

    /**
     *  ? store the user details in the redis database on connection
     */
    switch (auth.accountType) {
        case 'client':
            logger.info(clc.cyanBright('A client has connected'));
            await redisClient.json.set(`client:${auth.uuid}`, '.', {
                socketId: socket.id,
            });
            await redisClient.sAdd('onlineClients', auth.uuid);
            break;
        case 'partner':
            logger.info(clc.cyanBright('A partner has connected'));
            await redisClient.json.set(`partner:${auth.uuid}`, '.', {
                socketId: socket.id,
            });
            await redisClient.sAdd('onlinePartners', auth.uuid);
            break;
        case 'admin':
            logger.info(clc.cyanBright('An admin has connected'));
            break;
    }

    /**
     * ? remove user details from the redis database on disconnection
     */

    socket.on('disconnect', async () => {
        switch (auth.accountType) {
            case 'client':
                await redisClient.del(`client:${auth.uuid}`);
                logger.info(clc.red(` A client has disconnected`));

                break;
            case 'partner':
                await redisClient.del(`partner:${auth.uuid}`);
                logger.info(clc.red(` A partner has disconnected`));
                break;

            default:
                break;
        }
    });
};

export { IO, setIO, getIO, socketIOController };
