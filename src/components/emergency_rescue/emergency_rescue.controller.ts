import { RequestHandler } from "express";

class EmergencyRescueController {
  orderEmergencyRescue: RequestHandler = async (req, res, next) => {
    const {
      client,
      details
    } = req.body as {
      client:{
        firstName:string,
        lastName:string,
        phoneNumber:string,
      },
      details:{
        incall:boolean,
        outCall:boolean,
        carTowing:boolean,
        jumpStarting:boolean,
        accidentRescue:boolean,
        timeStamp:string,
        location:{
          latitude:string,
          longitude:string
        }
      }
    }
    try {
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default EmergencyRescueController;
