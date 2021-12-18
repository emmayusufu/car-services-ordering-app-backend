import { RequestHandler } from "express";
import { Client } from "../../database/entities/client.entity";

class ClientsController {
  getAll: RequestHandler = async (req, res, next) => {};

  getOne: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as {
      uuid: string;
    };
    res.json({ message: uuid });
  };

  verifyPhoneNumber: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    try {
      const client = Client.findOne({ phoneNumber });
      if (client) {
        res.status(200).json()
      } else {
        const newClient = new Client();
        newClient.phoneNumber = phoneNumber;
        await newClient.save();
        res.status(201).json();
      }
    } catch (error) {
      next(new Error(error));
    }
  };


  verifyOtp: RequestHandler = async (req, res, next) => {
    const { otp, phoneNumber } = req.body as {
      otp: string;
      phoneNumber: string;
    };
  };

  delete: RequestHandler = async (req, res, next) => {
    const { uuid } = req.body as {
      uuid: string;
    };
  };

  update: RequestHandler = async (req, res, next) => {
    const { uuid } = req.body as {
      uuid: string;
    };
  };
}

export default ClientsController;
