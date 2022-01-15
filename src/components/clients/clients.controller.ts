import { RequestHandler } from "express";
import { Client } from "../../database/entities/clients.entity";
import { PhoneNumberVerification, ProfileSetup } from "../../enums/enums";
import { generateOTP } from "../../utils/helpers";
import jwt from "jsonwebtoken";
import RedisClient from "../../utils/redis-manager";
import AfricasTalkingClient from "../../utils/africastalking-client";

class ClientsController {
  private _redisClient = RedisClient.getInstance();
  private _africasTalkingClient = AfricasTalkingClient.getInstance();

  getAll: RequestHandler = async (_req, res, next) => {
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
       if (error instanceof Error){
        next(new Error(error.message));
      }
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
       if (error instanceof Error){
        next(new Error(error.message));
      }
    }
  };

  verifyPhoneNumber: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const otp = generateOTP();
    try {
      const client = await Client.findOne({ phoneNumber });

      await this._redisClient.setValue(phoneNumber, otp, 360);
      await this._africasTalkingClient.sendSMS(
        [phoneNumber],
        `Your OTP from Biko Mechanic is : ${otp}`
      );
      if (client) {
        res.status(200).json({
          message: "client_already_exists",
          phoneNumber: client.phoneNumber,
        });
      } else {
        const newClient = new Client();
        newClient.phoneNumber = phoneNumber;
        await newClient.save();
        res.status(201).json({
          message: "new_client_created",
          phoneNumber: newClient.phoneNumber,
        });
      }
    } catch (error) {
       if (error instanceof Error){
        next(new Error(error.message));
      }
    }
  };

  verifyOtp: RequestHandler = async (req, res, next) => {
    const { otp, phoneNumber } = req.body as {
      otp: string;
      phoneNumber: string;
    };
    try {
      const value = await this._redisClient.getValue(phoneNumber);
      if (value) {
        if (otp === value) {
          const client = await Client.findOne({ where: { phoneNumber: phoneNumber } });
          if (client) {
            if (ProfileSetup.PENDING) {
              res
                .status(200)
                .json({ message: "profile_setup_pending", uuid: client.uuid });
            } else if (ProfileSetup.COMPLETE) {
              res.status(200).json({
                message: "profile_setup_complete",
                uuid: client.uuid,
                firstName: client.firstName,
                lastName: client.lastName,
                phoneNumber: client.phoneNumber,
              });
            }
          }
        } else {
          res.json({ message: "incorrect otp" });
        }
      } else {
        res.json({ message: "otp not found" });
      }
    } catch (error) {
       if (error instanceof Error){
        next(new Error(error.message));
      }
    }
  };

  profileSetup: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as { uuid: string };
    const { firstName, lastName } = req.body;
    try {
      const client = await Client.findOne({ uuid });
      if(!client) return
      if (client.phoneNumberVerification === PhoneNumberVerification.COMPLETE) {
        (client.firstName = firstName),
          (client.lastName = lastName),
          (client.profileSetup = ProfileSetup.COMPLETE);
        await client.save();
        res.status(200).json({
          uuid: client.uuid,
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
        });
      } else {
        res.status(405).json();
      }
    } catch (error) {
      if (error instanceof Error){
        next(new Error(error.message));
      }
    }
  };

  resendOTP: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    try {
      // redisClient.setEx(phoneNumber, 30, otp);
      res.json({ message: "success" });
    } catch (error) {
       if (error instanceof Error){
        next(new Error(error.message));
      }
    }
  };
}

export default ClientsController;
