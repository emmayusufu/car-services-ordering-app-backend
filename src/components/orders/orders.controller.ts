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
import { Partner } from 'src/database/entities/partners.entity';

class OrdersController {
    getAll: RequestHandler = async (_req, res, next) => {
        const orders = await Order.find({
            relations: ['partner', 'client'],
        });
        try {
            res.json({ message: 'success', orders });
        } catch (error) {
            next(new Error(error));
        }
    };

    getUserOrders = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { uuid, accountType } = req.user;

            switch (accountType) {
                case 'client':
                    const client = await Client.findOne({
                        where: { uuid: uuid },
                    });
                    const clientOrders = await Order.find({
                        where: { client: client },
                    });
                    res.json({ message: 'success', clientOrders });
                    break;

                case 'partner':
                    //     const partner = await Partner.findOne({
                    //         where: { uuid: uuid },
                    //     });
                    //     const partnerOrders = await Order.find({
                    //         where: { partner: partner },
                    //     });
                    //     res.json({ message: 'success', partnerOrders });
                    break;
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    placeOrder = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { uuid } = req.user;
        const orderRequest = req.body as OrderRequest;
        const { userLocation, details, orderType } = orderRequest;

        try {
            const client = await Client.findOne({ where: { uuid: uuid } });
            const order = new Order();
            order.client = client;
            (order.orderType = orderType),
                (order.orderDetails = JSON.stringify(details));
            order.clientLocation = JSON.stringify(userLocation);
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
