import express, { NextFunction, Request, Response } from 'express';
import http, { Server } from 'http';
import morgan from 'morgan';
import { logger } from './utils/logger';
import SocketIO from './utils/socket-io';
import { Socket } from 'socket.io';
import colors from 'colors/safe';
import Redis from './utils/redis-manager';
import ClientsRouter from './components/clients/clients.router';
import PartnersRouter from './components/partners/partners.router';
import EmergencyRescueRouter from './components/emergency_rescue/emergency_rescue.router';
import CarServicingRouter from './components/car_servicing/car_servicing.router';
import CarWashRouter from './components/car_wash/car_wash.router';
import OrdersRouter from './components/orders/orders.router';
import clc from 'cli-color';

const app = express();
const server: Server = http.createServer(app);
const io = new SocketIO(server).getIO();
const redisClient = Redis.getInstance().client;

[
    new ClientsRouter(),
    new PartnersRouter(),
    new EmergencyRescueRouter(),
    new CarServicingRouter(),
    new CarWashRouter(),
    new OrdersRouter(),
].map(({ path, router }) => {
    return app.use(path, router);
});

io.on('connection', (socket: Socket) => {
    const auth = socket.handshake.auth as { uuid: string; accountType: string };
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
            console.log(colors.red(`Something went wrong : ${error}`));
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

        // if user role is partner, remove from geo index
        if (auth.accountType === 'partner') {
            redisClient.zRem(
                'partnerLocations',
                `${auth.accountType}:${auth.uuid}`
            );
        }
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.get('/', (req, res) => {
    res.json({ message: `Server is up and running` });
});

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    const message = error.message || 'Something went wrong';
    logger.error(
        `[${req.method}] ${req.path} >> StatusCode:: {status}, Message:: ${message}`
    );
    res.status(500).json({ message });
});

export { io, server };
