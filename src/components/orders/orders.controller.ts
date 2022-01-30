import { RequestHandler, Response } from 'express';
import { getIO } from '../../utils/socket_io';
import { redisClient } from '../../utils/redis_client';
import { Order } from '../../database/entities/orders.entity';
import { Partner } from '../../database/entities/partners.entity';
import { Client } from '../../database/entities/clients.entity';
import { CarWashOrderRequest, OrderRequest } from '../../interfaces/interfaces';
import { OrderType } from '../../enums/enums';
import { logger } from '../../utils/logger';
// import { NotificationService } from '../../utils/notification_service';

class OrdersController {
    // private _notificationService = NotificationService.getInstance();
    private _orderEventsResponse: Response;

    getAll: RequestHandler = async (req, res, next) => {
        const partners = await Order.find({
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
        const orderRequest = req.body as OrderRequest;

        const { uuid, locationCoordinates } = orderRequest;

        try {
            const client = await Client.findOne({ where: { uuid: uuid } });

            const order = new Order();
            order.client = client;
            order.type = OrderType.CARWASH;
            await order.save();
            const adminSocketId = await redisClient.get('adminSocketId');
            getIO().to(adminSocketId).emit('incomingOrder', {
                type: OrderType.CARWASH,
                uuid: order.uuid,
                locationCoordinates,
            });
            res.status(201).json({ message: 'success' });
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

    incomingOrders: RequestHandler = async (req, res) => {
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
