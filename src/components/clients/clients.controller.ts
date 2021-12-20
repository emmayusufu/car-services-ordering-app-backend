import { RequestHandler } from "express";
import { Client } from "../../database/entities/clients.entity";
import { PhoneNumberVerification, ProfileSetup } from "../../enums/enums";
import { generateOTP, sendSMS } from "../../utils/helpers";
import { storeValue, getValue } from "../../utils/redis";
import jwt from "jsonwebtoken";

class ClientsController {
  getAll: RequestHandler = async (_req, res, next) => {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      next(new Error(error));
    }
  };

  getOne: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as {
      uuid: string;
    };
    try {
      const client = await Client.findOne({ uuid });
      res.status(200).json({ client });
    } catch (error) {
      next(new Error(error));
    }
  };

  verifyPhoneNumber: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const otp = generateOTP();
    try {
      const client = await Client.findOne({ phoneNumber });

      await storeValue(phoneNumber, otp, 360);
      // await sendSMS([phoneNumber], `Your otp from BIKO Mechanic is : ${otp}`);
      if (client) {
        res.status(200).json(); 
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
    try {
      const value = await getValue(phoneNumber);
      if (value) {
        if (otp === value) {
          const client = await Client.findOne({ phoneNumber });
          if (
            client.phoneNumberVerification === PhoneNumberVerification.PENDING
          ) {
            client.phoneNumberVerification = PhoneNumberVerification.COMPLETE;
            await client.save();
          }
          res.status(200).json();
        } else {
          res.json({ message: "incorrect otp" });
        }
      } else {
        res.json({ message: "otp not found" });
      }
    } catch (error) {
      next(new Error(error));
    }
  };

  profileSetup: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as { uuid: string };
    const { firstName, lastName } = req.body;
    try {
      const client = await Client.findOne({ uuid });
      if (client.phoneNumberVerification === PhoneNumberVerification.COMPLETE) {
        (client.firstName = firstName),
          (client.lastName = lastName),
          (client.profileSetup = ProfileSetup.COMPLETE);
        await client.save();
        const accessToken = jwt.sign(
          {
            uuid: client.uuid,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1hr" }
        );

        res.status(200).json({
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
          accessToken,
        });
      } else {
        res.status(405).json();
      }
    } catch (error) {
      next(new Error(error));
    }
  };

  resendOTP: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    try {
      // redisClient.setEx(phoneNumber, 30, otp);
      res.json({ message: "success" });
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default ClientsController;
