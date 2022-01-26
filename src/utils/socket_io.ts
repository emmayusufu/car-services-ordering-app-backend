import { Server, Socket } from 'socket.io';
import http from 'http';
import { redisClient } from './redis_client';
import clc from 'cli-color';

let IO: Server | null = null;

const setIO = (server: http.Server) => {
    IO = new Server(server, {
        cors: { origin: '*' },
    });
};

const getIO = (): Server | null => {
    return IO;
};

const socketIOController = (socket: Socket) => {
    const auth = socket.handshake.auth as {
        uuid: string;
        accountType: string;
    };
    const socketId: string = socket.id;

    const userData = JSON.stringify({
        socketId,
    });

    // TODO: store the user details in the redis database on connection
    redisClient
        .set(`${auth.accountType}:${auth.uuid}`, userData)
        .then((response: string) => {
            if (response === 'OK') {
                console.log(`\n`);
                console.log(
                    clc.cyanBright(
                        `${new Date().toLocaleString().replace(',', '')} : A ${
                            auth.accountType
                        } has connected`
                    )
                );
            }
        })
        .catch((error) => {
            console.log(clc.red(`Something went wrong : ${error}`));
        });

    // TODO: start listening to user location updates and storing them in the redis database if user has account type of partner
    if (auth.accountType === 'partner') {
        socket.on('locationUpdates', (data: any) => {
            const {
                latitude,
                longitude,
                uuid,
            }: { latitude: string; longitude: string; uuid: string } =
                JSON.parse(data);
            redisClient
                .geoAdd('partnerLoctions', {
                    latitude: latitude,
                    longitude: longitude,
                    member: uuid,
                })
                .catch((error) => {
                    console.log(clc.red(`location update error ${error}`));
                });
        });
    }

    //   TODO: start listening for order responses from respective partners
    socket.on('orderResponse', (data) => {
        console.log(`\n`);
        console.log(clc.yellow(`Order response data is ${data}`));
    });

    // TODO: remove user details from the redis database on disconnection i.e., personal details and location
    socket.on('disconnect', () => {
        redisClient
            .del(`${auth.accountType}:${auth.uuid}`)
            .then((value: number) => {
                if (value) {
                    console.log(`\n`);
                    console.log(
                        clc.red(
                            `${new Date()
                                .toLocaleString()
                                .replace(',', '')} : A ${
                                auth.accountType
                            } has disconnected`
                        )
                    );
                } else {
                    console.log('Failed to remove disconnected user');
                }
            });

        // TODO: if user role is partner, remove from geo index
        if (auth.accountType === 'partner') {
            redisClient.zRem(
                'partnerLocations',
                `${auth.accountType}:${auth.uuid}`
            );
        }
    });
};

export { IO, setIO, getIO, socketIOController };
