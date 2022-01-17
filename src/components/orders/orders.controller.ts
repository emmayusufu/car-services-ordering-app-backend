import { RequestHandler } from 'express';
import { io } from '../../app';
import RedisManager from '../../utils/redis-manager';
import { Order } from '../../database/entities/orders.entity';
import { Partner } from '../../database/entities/partners.entity';
import { Client } from '../../database/entities/clients.entity';
import { CarWashOrderRequest } from '../../interfaces/interfaces';

class OrdersController {
    private _redisClient = RedisManager.getInstance().client;

    getAll: RequestHandler = async (req, res, next) => {
        // const {} = req.body;

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
        // const { locationCoordinates, uuid } = req.body as CarWashOrderRequest;

        // const client = await Client.findOne({ where: { uuid: uuid } });

        const partnerDetails = await this._redisClient.get(`partner:12345`);
        const { socketId } = JSON.parse(partnerDetails);
        io.to(socketId).emit('orderRequest', 'You have a new order');

        // const nearByPartners = await this._redisClient.geoSearch(
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

        try {
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
