import { RequestHandler } from "express";
import {Client} from "../../database/entities/clients.entity"
import {Partner} from "../../database/entities/partners.entity"


class CarServicingController {
  orderCarServicing: RequestHandler = async (req, res, next) => {
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
        services:{label:string,check:boolean,replace:boolean}[],
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
  
  completeOrder:RequestHandler = (req,res,next)=>{
    const {} = req.body
    try {
      
    } catch (error) {
      next(new Error(error))
    }
  }
}

export default CarServicingController;
