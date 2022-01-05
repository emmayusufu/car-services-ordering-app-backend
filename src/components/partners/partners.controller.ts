import { RequestHandler } from "express";
import { Partner } from "../../database/entities/partners.entity";
import {
  PartnerType,
  PhoneNumberVerification,
  ProfileSetup,
} from "../../enums/enums";
import { generateOTP } from "../../utils/helpers";
// import jwt from "jsonwebtoken";
import { Individual } from "../../database/entities/individuals.entity";
import { Company } from "../../database/entities/companies.entity";
import { CarWash } from "../../database/entities/car_wash.entity";
import { CarServicing } from "../../database/entities/car_servicing.entity";
import { EmergencyRescue } from "../../database/entities/emergency_rescue.entity";
import RedisClient from "../../utils/redis-client";
import AfricasTalkingClient from "../../utils/africastalking-client";

class PartnersController {

  private redisClient = RedisClient.getInstance()
  private africasTalkingClient  = AfricasTalkingClient.getInstance()

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

  verifyOtp: RequestHandler = async (req, res, next) => {
    const { otp, phoneNumber } = req.body as {
      otp: string;
      phoneNumber: string;
    };
    try {
      const value = await this.redisClient.getValue(phoneNumber);
      if (value) {
        if (otp === value) {
          const partner = await Partner.findOne({ phoneNumber });
          if (
            partner.phoneNumberVerification === PhoneNumberVerification.PENDING
          ) {
            partner.phoneNumberVerification = PhoneNumberVerification.COMPLETE;
            await partner.save();
          }
          res.status(200).json({ partner });
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

  verifyPhoneNumber: RequestHandler = async (req, res, next) => {
    const { phoneNumber } = req.body as { phoneNumber: string };
    const otp = generateOTP();
    try {
      const partner = await Partner.findOne({ phoneNumber });
      await this.redisClient.setValue(phoneNumber, otp, 360);
      await this.africasTalkingClient.sendSMS([phoneNumber], `Your otp from BIKO Mechanic is : ${otp}`);
      if (partner) {
        res.status(200).json();
      } else {
        const newPartner = new Partner();
        newPartner.phoneNumber = phoneNumber;
        await newPartner.save();
        res.status(201).json();
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

      const partner = await Partner.findOne({ uuid });
      partner.individualDetails = individual;
      partner.profileSetup = ProfileSetup.COMPLETE;
      partner.partnerType = PartnerType.INDIVIDUAL;
      await partner.save();

      res.status(201).json();
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
      partner.partnerType = PartnerType.COMPANY;
      await partner.save();

      res.status(201).json();
    } catch (error) {
      next(new Error(error));
    }
  };

  registerServices: RequestHandler = async (req, res, next) => {
    const { carWash, carServicing, emergencyRescue } = req.body as {
      carWash: {
        inCall: boolean;
        outCall: boolean;
      };
      carServicing: {
        inCall: boolean;
        outCall: boolean;
        engineOil: boolean;
        gearboxOil: boolean;
        sparkPlugs: boolean;
        airFilter: boolean;
        brakePads: boolean;
        tyres: boolean;
      };
      emergencyRescue: {
        carTowing: boolean;
        jumpStarting: boolean;
      };
    };

    try {
      if (carServicing) {
        const row = new CarServicing();
        row.inCall = carServicing.inCall;
        row.outCall = carServicing.outCall;
        row.engineOil = carServicing.engineOil;
        row.gearboxOil = carServicing.gearboxOil;
        row.sparkPlugs = carServicing.sparkPlugs;
        row.airFilter = carServicing.airFilter;
        row.brakePads = carServicing.brakePads;
        row.tyres = carServicing.tyres;
        await row.save();
      }
      if (carWash) {
        const row = new CarWash();
        row.inCall = carWash.inCall;
        row.outCall = carWash.outCall;
        await row.save();
      }
      if (emergencyRescue) {
        const row = new EmergencyRescue();
        row.carTowing = emergencyRescue.carTowing;
        row.jumpStarting = emergencyRescue.jumpStarting;
        await row.save();
      }
    } catch (error) {
      next(new Error(error));
    }
  };
}

export default PartnersController;
