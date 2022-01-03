import { RequestHandler } from "express";

class CarWashController {
  orderCarWash: RequestHandler = async (req, res, next) => {
    const { client, details } = req.body as {
      client: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
      };
      details: {
        incall: boolean;
        outCall: boolean;
        timeStamp: string;
        location: {
          latitude: string;
          longitude: string;
        };
      };
    };
    try {
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default CarWashController;
