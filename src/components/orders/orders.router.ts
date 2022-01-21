import { Router } from 'express';
import { AppRouter } from '../../interfaces/interfaces';
import OrdersController from './orders.controller';

class OrdersRouter implements AppRouter {
    path = '/orders';
    controller = new OrdersController();
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes = () => {
        this.router
            .get('/', this.controller.getAll)
            .get('/:uuid', this.controller.getOne)
            .post('/order-car-wash', this.controller.orderCarWash)
            .post('/order-car-servicing', this.controller.orderCarServicing)
            .post(
                '/order-emergency-rescue',
                this.controller.orderEmergencyRescue
            );
    };
}

export default OrdersRouter;
