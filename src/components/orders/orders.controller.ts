import { RequestHandler } from "express";

class OrdersController {
  getAll: RequestHandler = async (req, res, next) => {
    const {} = req.body;

    try {
    } catch (error) {
      next(new Error(error));
    }
  };

  getOne: RequestHandler = async (req, res, next) => {
    const {} = req.body;

    try {
    } catch (error) {
      next(new Error(error));
    }
  };

  orderCarWash: RequestHandler = async (req, res, next) => {
    const {} = req.body;

    try {
    } catch (error) {
      next(new Error(error));
    }
  };

  orderCarServicing: RequestHandler = async (req, res, next) => {
    const {} = req.body;

    try {
    } catch (error) {
      next(new Error(error));
    }
  };

  orderEmergencyRescue: RequestHandler = async (req, res, next) => {
    const {} = req.body;

    try {
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default OrdersController;
