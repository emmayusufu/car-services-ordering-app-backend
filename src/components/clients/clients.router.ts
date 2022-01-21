import { Router } from 'express';
import { AppRouter } from '../../interfaces/interfaces';
import ClientsController from './clients.controller';

class ClientsRouter implements AppRouter {
    router = Router();
    controller = new ClientsController();
    path = '/clients';

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router
            .get('/', this.controller.getAll)
            .get('/:uuid', this.controller.getOne)
            .put('/otp-verification', this.controller.verifyOtp)
            .put('/profile-setup/:uuid', this.controller.profileSetup)
            .post(
                '/phone-number-verification',
                this.controller.verifyPhoneNumber
            );
    }
}

export default ClientsRouter;
