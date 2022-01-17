import { RequestHandler } from 'express';
import { io } from '../../app';
import RedisManager from '../../utils/redis-manager';

class OrdersController {
    private _redisClient = RedisManager.getInstance().client;

    getAll: RequestHandler = async (req, res, next) => {
        const {} = req.body;

        try {
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
        const { locationCoordinates } = req.body as {
            firstName: string;
            lastName: string;
            uuid: string;
            phoneNumber: string;
            locationCoordinates: {
                latitude: string;
                longitude: string;
            };
        };

        const nearByPartners = await this._redisClient.geoSearch(
            'partnerLocations',
            {
                latitude: locationCoordinates.latitude,
                longitude: locationCoordinates.longitude,
            },
            { radius: 5, unit: 'km' },
            { SORT: 'ASC', COUNT: 10 }
        );

        console.log(nearByPartners);

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
