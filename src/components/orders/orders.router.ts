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
            .get('/', authenticateAccessToken, this.controller.getOrders)
            .post(
                '/place-order',
                authenticateAccessToken,
                this.controller.placeOrder
            )
            .put(
                '/rate-order/uuid',
                authenticateAccessToken,
                this.controller.rateOrder
            )
            .post('/dispatch-order', this.controller.dispatchOrder)
            .put(
                '/update-order-progress/:uuid',
                // authenticateAccessToken,
                this.controller.updateOrderProgress
            );
    };
}

export default OrdersRouter;
