import { Router } from "express";
import { AppRouter } from "../../interfaces/interfaces";
import OrdersController from "./orders.controller";

class OrdersRouter implements AppRouter {
  path = "/orders";
  controller = new OrdersController();
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.get("/", this.controller.getAll);
    this.router.get("/:uuid", this.controller.getOne);
    this.router.post("/car-wash", this.controller.orderCarWash);
    this.router.post("/car-servicing", this.controller.orderCarServicing);
    this.router.post("/emergency-rescue", this.controller.orderEmergencyRescue);
  };
}

export default OrdersRouter;
