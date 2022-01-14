import { Router } from "express";
import { AppRouter } from "../../interfaces/interfaces";
import CarWashController from "./car_wash.controller";

class CarWashRouter implements AppRouter {
    path = "/car-wash";
    router = Router();
    controller = new CarWashController()

    constructor () {
        this.initializeRoutes()
    }


    initializeRoutes () {
        this.router.post("/order",this.controller.orderCarWash)
    }
}

export default CarWashRouter