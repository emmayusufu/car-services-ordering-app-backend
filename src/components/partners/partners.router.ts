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
            .get('/:uuid', this.controller.getOne)
            .post(
                '/phone-number-verification',
                this.controller.verifyPhoneNumber
            )
            .post('/otp-verification', this.controller.verifyOtp)
            .put(
                '/individual-profile-setup/:uuid',
                this.controller.individualProfileSetup
            )
            .put(
                '/company-profile-setup/:uuid',
                this.controller.companyProfileSetup
            )
            .post(
                '/service-registration/:uuid',
                this.controller.registerServices
            );
    }
}

export default PartnersRouter;
