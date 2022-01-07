import { RequestHandler } from "express";
import { Partner } from "../../database/entities/partners.entity";
import {
  AccountType,
  PhoneNumberVerification,
  ProfileSetup,
} from "../../enums/enums";
import { generateOTP } from "../../utils/helpers";
import { Individual } from "../../database/entities/individuals.entity";
import { Company } from "../../database/entities/companies.entity";
import RedisClient from "../../utils/redis-client";
import AfricasTalkingClient from "../../utils/africastalking-client";

class PartnersController {
  private _redisClient = RedisClient.getInstance();
  private _africasTalkingClient = AfricasTalkingClient.getInstance();

  getAll: RequestHandler = async (_req, res, next) => {
    try {
      const partners = await Partner.find({
        relations: ["individualDetails", "companyDetails"],
      });
      res.status(200).json(partners);
    } catch (error) {
      next(new Error(error));
    }
  };

  getOne: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as {
      uuid: string;
    };
    try {
      const partner = await Partner.findOne({ uuid });
      res.status(200).json({ partner });
    } catch (error) {
      next(new Error(error));
    }
  };

  verifyPhoneNumber: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const otp = generateOTP();
    try {
      const partner = await Partner.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      await this._redisClient.setValue(phoneNumber, otp, 360);
      // await this._africasTalkingClient.sendSMS(
      //   [phoneNumber],
      //   `Your OTP from BIKO Mechanic is : ${otp}`
      // );
      if (partner) {
        res.status(200).json({ message: "partner_already_exits" });
      } else {
        const newPartner = new Partner();
        newPartner.phoneNumber = phoneNumber;
        await newPartner.save();
        res.status(201).json({ message: "new_partner_created" });
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
      const value = await this._redisClient.getValue(phoneNumber);
      if (value) {
        if (otp === value) {
          const partner = await Partner.findOne({
            where: {
              phoneNumber: phoneNumber,
            },
            relations: ["individualDetails", "companyDetails"],
          });
          switch (partner.profileSetup) {
            case ProfileSetup.PENDING:
              res.json({
                message: "profile_setup_pending",
                uuid: partner.uuid,
              });
              break;
            case ProfileSetup.COMPLETE:
              res.json({
                message: "profile_setup_complete",
                user: partner,
              });
              break;
            default:
              break;
          }
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

  individualProfileSetup: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as { uuid: string };
    const { firstName, lastName } = req.body as {
      firstName: string;
      lastName: string;
    };
    try {
      const individual = new Individual();
      (individual.firstName = firstName), (individual.lastName = lastName);
      await individual.save();

      const partner = await Partner.findOne({ where: { uuid: uuid } });
      partner.individualDetails = individual;
      partner.profileSetup = ProfileSetup.COMPLETE;
      partner.accountType = AccountType.INDIVIDUAL;
      await partner.save();

      res.status(201).json({ message: "success" });
    } catch (error) {
      next(new Error(error));
    }
  };

  companyProfileSetup: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as { uuid: string };
    const { companyName } = req.body as {
      companyName: string;
    };
    try {
      const company = new Company();
      (company.companyName = companyName), await company.save();

      const partner = await Partner.findOne({ uuid });
      partner.companyDetails = company;
      partner.profileSetup = ProfileSetup.COMPLETE;
      partner.accountType = AccountType.COMPANY;
      await partner.save();

      res.status(201).json({ message: "succcess" });
    } catch (error) {
      next(new Error(error));
    }
  };

  registerServices: RequestHandler = async (req, res, next) => {
    const { uuid } = req.params as {
      uuid: string;
    };
    const { carWash, carServicing, emergencyRescue } = req.body as {
      carWash: boolean;
      carServicing: boolean;
      emergencyRescue: boolean;
    };
    try {
      const partner = await Partner.findOne({
        where: { uuid: uuid },
        relations: ["individualDetails", "companyDetails"],
      });
      (partner.carWash = carWash || false),
        (partner.carServicing = carServicing || false);
      partner.emergencyRescue = emergencyRescue || false;
      await partner.save();
      res.json({ message: "success", user:partner });
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default PartnersController;
