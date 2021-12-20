import { Router } from "express";
import { AppRouter } from "../../interfaces/interfaces";
import CarRepairController from "./car_repair.controller";

class CarRepairRouter implements AppRouter {
  path = "/car-repair";
  router = Router();
  controller = new CarRepairController();
}

export default CarRepairRouter;
