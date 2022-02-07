import { NextFunction, RequestHandler, Response, Request } from 'express';
import { getIO } from '../../utils/socket_io';
import { redisClient } from '../../utils/redis_client';
import { Order } from '../../database/entities/orders.entity';
import { Client } from '../../database/entities/clients.entity';
import {
    CarWashOrderRequest,
    IGetUserAuthInfoRequest,
    OrderRequest,
} from '../../interfaces/interfaces';
import { OrderStatus, OrderType } from '../../enums/enums';
import { logger } from '../../utils/logger';

class OrdersController {
    getAll: RequestHandler = async (req, res, next) => {
        const orders = await Order.find({
            relations: ['partner', 'client'],
        });
        try {
            res.json({ message: 'success', orders });
        } catch (error) {
            next(new Error(error));
        }
    };

    orderService = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { uuid } = req.user;
        const orderRequest = req.body as OrderRequest;
        const { locationCoordinates, details, type } = orderRequest;

        try {
            const client = await Client.findOne({ where: { uuid: uuid } });
            const order = new Order();
            order.client = client;
            (order.type = type), (order.details = JSON.stringify(details));
            order.location = JSON.stringify(locationCoordinates);
            await order.save();
            const adminSocketId = await redisClient.get('adminSocketId');
            if (adminSocketId) {
                getIO().to(adminSocketId).emit('pendingOrder', order);
            }
            res.status(200).json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    updateOrder = async (req: Request, res: Response, next: NextFunction) => {
        const { uuid } = req.params as { uuid: string };
        const { status, review, rating } = req.body as {
            status: string;
            review: string;
            rating: number;
        };
        try {
            const order = await Order.findOne({ where: { uuid } });
            order.status = status ?? order.status;
            order.rating = rating ?? order.rating;
            order.review = review ?? order.review;
            await order.save();
            res.json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };
}

export default OrdersController;
