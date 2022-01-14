import { Router } from "express";
import { AppRouter } from "../../interfaces/interfaces";
import CarServicingController from "./car_servicing.controller";

class CarServicingRouter implements AppRouter {
    path = "/car-servicing";
    router = Router();
    controller = new CarServicingController()

    constructor () {
        this.initializeRoutes()
    }


    initializeRoutes () {
        this.router.post("/order",this.controller.orderCarServicing)
    }
}

export default CarServicingRouter