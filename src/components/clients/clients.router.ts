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
            .put(
                '/phone-number-verification',
                this.controller.phoneNumberVerification
            )
            .put('/profile-setup/:uuid', this.controller.profileSetup)
            .post(
                '/continue-with-phone-number',
                this.controller.continueWithPhoneNumber
            );
    }
}

export default ClientsRouter;
// > require('crypto').randomBytes(64).toString('hex')
// '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'
