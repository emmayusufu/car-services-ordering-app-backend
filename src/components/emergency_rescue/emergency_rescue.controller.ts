import { RequestHandler } from "express";

class EmergencyRescueController {
  orderEmergencyRescue: RequestHandler = async (req, res, next) => {
    try {
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default EmergencyRescueController;
