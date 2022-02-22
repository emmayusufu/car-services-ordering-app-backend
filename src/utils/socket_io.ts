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
            await redisClient.hSet('onClientsSocketIds', auth.uuid, socket.id);
            await redisClient.sAdd('onlineClientsUuids', auth.uuid);
            logger.info(clc.cyanBright('A client has connected'));
            break;
        case 'partner':
            await redisClient.hSet(
                'onlinePartnersSocketIds',
                auth.uuid,
                socket.id
            );
            await redisClient.sAdd('onlinePartnersUuids', auth.uuid);
            logger.info(clc.cyanBright('A partner has connected'));
            break;
        case 'admin':
            let obj = {};
            obj['superAdmin'] = socket.id;
            await redisClient.hSet('onlineAdminSocketIds', obj);
            logger.info(clc.yellowBright('A super admin has connected'));
            break;
    }

    /**
     * ? remove user details from the redis database on disconnection
     */

    socket.on('disconnect', async () => {
        switch (auth.accountType) {
            case 'client':
                await redisClient.hDel('onClientsSocketIds', auth.uuid);
                await redisClient.sRem('onlineClientsUuids', auth.uuid);
                logger.info(clc.red(` A client has disconnected`));

                break;
            case 'partner':
                await redisClient.sRem('onlinePartnersUuids', auth.uuid);
                logger.info(clc.red(` A partner has disconnected`));
                break;
            case 'admin':
                await redisClient.hDel('onlineAdminSocketIds', 'superAdmin');
                logger.info(clc.red(`A super admin has disconnected`));
                break;

            default:
                break;
        }
    });
};

export { IO, setIO, getIO, socketIOController };
