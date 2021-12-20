import { RequestHandler } from "express";
import { Partner } from "../../database/entities/partners.entity";
import {
  PartnerType,
  PhoneNumberVerification,
  ProfileSetup,
} from "../../enums/enums";
import { generateOTP, sendSMS } from "../../utils/helpers";
import { storeValue, getValue } from "../../utils/redis";
// import jwt from "jsonwebtoken";
import { Individual } from "../../database/entities/individuals.entity";
import { Company } from "../../database/entities/companies.entity";

class PartnersController {
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
      const value = await getValue(phoneNumber);
      if (value) {
        if (otp === value) {
          const partner = await Partner.findOne({ phoneNumber });
          if (
            partner.phoneNumberVerification === PhoneNumberVerification.PENDING
          ) {
            partner.phoneNumberVerification = PhoneNumberVerification.COMPLETE;
            await partner.save();
          }
          res.status(200).json({partner});
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
      await storeValue(phoneNumber, otp, 360);
      // await sendSMS([phoneNumber], `Your otp from BIKO Mechanic is : ${otp}`);
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
}

export default PartnersController;
