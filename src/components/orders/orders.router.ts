import { Router } from 'express';
import { AppRouter } from '../../interfaces/interfaces';
import { authenticateAccessToken } from '../../utils/jwt_authentication';
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
            .post(
                '/order-service',
                authenticateAccessToken,
                this.controller.orderService
            )
            .put('/update-order/:uuid', this.controller.updateOrder);
    };
}

export default OrdersRouter;
