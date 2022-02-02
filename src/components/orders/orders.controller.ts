import { NextFunction, RequestHandler, Response } from 'express';
import { getIO } from '../../utils/socket_io';
import { redisClient } from '../../utils/redis_client';
import { Order } from '../../database/entities/orders.entity';
import { Client } from '../../database/entities/clients.entity';
import {
    CarWashOrderRequest,
    IGetUserAuthInfoRequest,
    OrderRequest,
} from '../../interfaces/interfaces';
import { OrderType } from '../../enums/enums';
import { logger } from '../../utils/logger';

class OrdersController {
    private _orderEventsResponse: Response;

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

    request = async (
        req: IGetUserAuthInfoRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { uuid } = req.user;
        const orderRequest = req.body as OrderRequest;
        const { locationCoordinates, details } = orderRequest;

        const carWashOrderDetails = details as CarWashOrderRequest;

        try {
            const client = await Client.findOne({ where: { uuid: uuid } });
            const order = new Order();
            order.client = client;
            order.type = OrderType.CARWASH;
            order.details = JSON.stringify(carWashOrderDetails);
            await order.save();
            const adminSocketId = await redisClient.get('adminSocketId');
            if (adminSocketId) {
                getIO().to(adminSocketId).emit('incomingOrder', {
                    type: OrderType.CARWASH,
                    uuid: order.uuid,
                    locationCoordinates,
                    carWashOrderDetails,
                });
            }
            res.status(200).json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };
    pendingOrders: RequestHandler = async (req, res) => {
        const headers = {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
        };
        res.writeHead(200, headers);

        this._orderEventsResponse = res;

        try {
            const orders = await Order.find({
                relations: ['partner', 'client'],
            });
            const data = `data: ${JSON.stringify(orders)}\n\n`;

            res.write(data);
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
            }
        }

        req.on('close', () => {
            console.log(`Connection closed`);
        });
    };
}

export default OrdersController;
