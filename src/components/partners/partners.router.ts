import { Router } from 'express';
import { AppRouter } from '../../interfaces/interfaces';
import PartnersController from './partners.controller';

class PartnersRouter implements AppRouter {
    router = Router();
    controller = new PartnersController();
    path = '/partners';

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router
            .get('/', this.controller.getAll)
            .post(
                '/continue-with-phone-number',
                this.controller.continueWithPhoneNumber
            )
            .post(
                '/phone-number-verification',
                this.controller.phoneNumberVerification
            )
            .post('/create', this.controller.createPartner);
    }
}

export default PartnersRouter;
