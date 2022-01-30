import { RequestHandler } from 'express';
import { getIO } from '../../utils/socket_io';
import { redisClient } from '../../utils/redis_client';
import { Order } from '../../database/entities/orders.entity';
import { Partner } from '../../database/entities/partners.entity';
import { Client } from '../../database/entities/clients.entity';
import { CarWashOrderRequest } from '../../interfaces/interfaces';
import { OrderType } from '../../enums/enums';
// import { NotificationService } from '../../utils/notification_service';

class OrdersController {
    // private _notificationService = NotificationService.getInstance();

    getAll: RequestHandler = async (req, res, next) => {
        const partners = await Partner.find({
            relations: ['partner', 'client'],
        });
        res.json(partners);

        try {
            res.json({ message: 'success' });
        } catch (error) {
            next(new Error(error));
        }
    };

    getOne: RequestHandler = async (req, res, next) => {
        const {} = req.body;

        try {
        } catch (error) {
            next(new Error(error));
        }
    };

    orderCarWash: RequestHandler = async (req, res, next) => {
        const { uuid, locationCoordinates } = req.body as CarWashOrderRequest;

        try {
            const client = await Client.findOne({ where: { uuid: uuid } });

            const order = new Order();
            order.client = client;
            order.type = OrderType.CARWASH;

            await order.save();

            // const partnerDetails = await redisClient.get(`partner:12345`);
            // const { socketId } = JSON.parse(partnerDetails);

            // const nearByPartners = await this._redisClient.commandsExecutor(
            //     {
            //         BUFFER_MODE: true,
            //         transformArguments: function (this: void, ...args: any[]) {
            //             throw new Error('Function not implemented.');
            //         },
            //     },
            //     ['']
            // );

            /*
            '[string, GeoSearchFrom, GeoSearchBy, GeoSearchOptions?]'.
            */

            // const nearByPartners = await this._redisClient.geoSearch(,
            //     'partnerLocations',
            //     {
            //         longitude: locationCoordinates.longitude,
            //         latitude: locationCoordinates.latitude,
            //     },
            //     {
            //         radius: 5,
            //         unit: 'km',
            //     },
            //     {
            //         SORT: 'ASC',
            //         COUNT: 10,
            //     }
            // );

            // console.log(nearByPartners);

            res.json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    orderCarServicing: RequestHandler = async (req, res, next) => {
        const {} = req.body;

        try {
        } catch (error) {
            next(new Error(error));
        }
    };

    orderEmergencyRescue: RequestHandler = async (req, res, next) => {
        const {} = req.body;

        try {
        } catch (error) {
            next(new Error(error));
        }
    };
}

export default OrdersController;
