import { Server, Socket } from 'socket.io';
import http from 'http';
import { redisClient } from './redis_client';
import clc from 'cli-color';
import { logger } from './logger';
import { ServerToClientEvents } from '../interfaces/interfaces';

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
    const auth = socket.handshake.auth as {
        uuid: string;
        accountType: string;
    };
    const socketId: string = socket.id;

    //  store the user details in the redis database on connection
    if (auth.accountType !== 'admin') {
        redisClient.json
            .set(`${auth.accountType}:${auth.uuid}`, '.', {
                socketId,
            })
            .then((response: string) => {
                if (response === 'OK') {
                    console.log(`\n`);
                    console.log(
                        clc.cyanBright(
                            `${new Date()
                                .toLocaleString()
                                .replace(',', '')} : A ${
                                auth.accountType
                            } has connected`
                        )
                    );
                }
            })
            .catch((error) => {
                console.log(clc.red(`Something went wrong : ${error}`));
            });
    } else {
        await redisClient.set('adminSocketId', socketId);
        logger.info(clc.cyanBright('An admin has connected'));
    }

    //  start listening to user location updates and storing them in the redis database if user has account type of partner
    if (auth.accountType === 'partner') {
        socket.on('locationUpdates', (data: any) => {
            const {
                latitude,
                longitude,
                uuid,
            }: { latitude: string; longitude: string; uuid: string } =
                JSON.parse(data);
            redisClient
                .geoAdd('partnerLocations', {
                    latitude: latitude,
                    longitude: longitude,
                    member: uuid,
                })
                .catch((error) => {
                    console.log(clc.red(`location update error ${error}`));
                });
        });
    }

    //    start listening for order responses from respective partners
    socket.on('orderResponse', (data) => {
        console.log(`\n`);
        console.log(clc.yellow(`Order response data is ${data}`));
    });

    //  remove user details from the redis database on disconnection i.e., personal details and location
    socket.on('disconnect', async () => {
        if (auth.accountType !== 'admin') {
            redisClient
                .del(`${auth.accountType}:${auth.uuid}`)
                .then((value: number) => {
                    if (value) {
                        console.log(`\n`);
                        logger.info(
                            clc.red(
                                `${new Date()
                                    .toLocaleString()
                                    .replace(',', '')} : A ${
                                    auth.accountType
                                } has disconnected`
                            )
                        );
                    } else {
                        logger.error('Failed to remove disconnected user');
                    }
                });
        }
        //  if user role is partner, remove from geo index
        if (auth.accountType === 'partner') {
            redisClient.zRem(
                'partnerLocations',
                `${auth.accountType}:${auth.uuid}`
            );
        }
        if (auth.accountType === 'admin') {
            await redisClient.del('adminSocketId');
            logger.info(clc.red(`An admin has disconnected`));
        }
    });
};

export { IO, setIO, getIO, socketIOController };
