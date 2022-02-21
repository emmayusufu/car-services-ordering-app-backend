import { NextFunction, RequestHandler, Response, Request } from 'express';
import { getIO } from '../../utils/socket_io';
import { redisClient } from '../../utils/redis_client';
import { Order } from '../../database/entities/orders.entity';
import { Client } from '../../database/entities/clients.entity';
import {
    IGetUserAuthInfoRequest,
    OrderRequest,
} from '../../interfaces/interfaces';
import { Partner } from '../../database/entities/partners.entity';
import { logger } from '../../utils/logger';
import clc from 'cli-color';

class OrdersController {
    getOrders = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.user;
            switch (user.accountType) {
                case 'client':
                    const client = await Client.findOne({
                        where: { uuid: user.uuid },
                    });
                    const clientOrders = await Order.find({
                        where: { client: client },
                    });
                    res.json({ message: 'success', clientOrders });
                    break;

                case 'partner':
                    const partner = await Partner.findOne({
                        where: { uuid: user.uuid },
                    });
                    const partnerOrders = await Order.find({
                        where: { partner: partner },
                    });
                    res.json({ message: 'success', partnerOrders });
                    break;

                case 'admin':
                    const orders = await Order.find({
                        relations: ['partner', 'client'],
                    });
                    res.json({ message: 'success', orders });
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
        const user = req.user;
        const orderRequest = req.body as OrderRequest;
        const { userLocation, details, orderType } = orderRequest;

        try {
            const client = await Client.findOne({ where: { uuid: user.uuid } });
            const order = new Order();
            order.client = client;
            (order.orderType = orderType), (order.orderDetails = details);
            order.clientLocation = userLocation;
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

    rateOrder = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user;
        const params = req.params as { uuid: string };
        const body = req.body as {
            rating: number;
            review: string;
        };
        try {
            const order = await Order.findOne({
                where: { uuid: params.uuid },
            });
            order.rating = body.rating ?? order.rating;
            order.review = body.review ?? order.review;
            await order.save();
            res.json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    updateOrderProgress = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        const params = req.params as { uuid: string };
        const body = req.body as {
            newOrderProgress: string;
            currentOrderProgress: string;
        };
        try {
            const order = await Order.findOne({
                where: { uuid: params.uuid },
            });
            order.orderProgress = body.newOrderProgress;

            await order.save();

            // if (body.newOrderProgress === 'Complete') {
            //     const clientUuid = order.client.uuid;
            //     const clientData = (await redisClient.json.get(
            //         `client:${clientUuid}`,
            //         {
            //             path: '.',
            //         }
            //     )) as {
            //         socketId: string;
            //     };
            //     getIO().to(clientData.socketId).emit('order_update', {
            //         orderUuid: order.uuid,
            //         orderProgress: 'Complete',
            //     });
            // }

            res.json({
                message: 'success',
                orderUuid: order.uuid,
                currentOrderProgress: order.orderProgress,
                previousOrderProgress: body.currentOrderProgress,
            });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    dispatchOrder: RequestHandler = async (req, res, next) => {
        const body = req.body as {
            orderUuid: string;
            partnerUuid: string;
        };
        try {
            const partner = await Partner.findOne({
                where: { uuid: body.partnerUuid },
            });

            const order = await Order.findOne({
                where: { uuid: body.orderUuid },
                relations: ['client'],
            });

            order.partner = partner;

            await order.save();

            const partnerData = (await redisClient.json.get(
                `partner:${body.partnerUuid}`,
                {
                    path: '.',
                }
            )) as {
                socketId: string;
            };

            if (partnerData !== null) {
                getIO()
                    .to(partnerData.socketId)
                    .emit('client_order_request', {
                        ...order,
                        partner: undefined,
                    });
            } else {
                logger.error('Partner is offline');
            }

            res.json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };
}

export default OrdersController;
