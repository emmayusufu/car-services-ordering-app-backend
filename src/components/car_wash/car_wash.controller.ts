import { RequestHandler } from "express";

class CarWashController {
  orderCarWash: RequestHandler = async (req, res, next) => {
    try {
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default CarWashController;
