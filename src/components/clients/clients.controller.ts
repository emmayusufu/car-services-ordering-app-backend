import { RequestHandler } from "express";

class ClientsController {
  getAll: RequestHandler = async (req, res, next) => {};

  getOne: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as {
      uuid: string;
    };
    res.json({message:uuid})
  };

  verifyPhoneNumber: RequestHandler = async (req, res, next) => {};

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
