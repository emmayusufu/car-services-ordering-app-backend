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
            .get('/', authenticateAccessToken, this.controller.getAll)
            .get('/pending-orders', this.controller.pendingOrders)
            .post('/order', authenticateAccessToken, this.controller.request);
    };
}

export default OrdersRouter;
