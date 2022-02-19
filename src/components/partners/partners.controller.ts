import { RequestHandler } from 'express';
import { Partner } from '../../database/entities/partners.entity';
import { generateOTP } from '../../utils/helpers';
import { redisClient } from '../../utils/redis_client';
import AfricasTalkingClient from '../../utils/africastalking-client';
import { generateAccessToken } from '../../utils/jwt_authentication';
import clc from 'cli-color';
import { logger } from '../../utils/logger';

class PartnersController {
    private _africasTalkingClient = AfricasTalkingClient.getInstance();

    getAll: RequestHandler = async (_req, res, next) => {
        try {
            const partners = await Partner.find({
                relations: ['individualDetails', 'companyDetails'],
            });
            res.status(200).json(partners);
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    continueWithPhoneNumber: RequestHandler = async (req, res, next) => {
        const body = req.body as { phoneNumber: string };
        const otp = generateOTP();
        logger.info(clc.yellow(otp));
        try {
            const partner = await Partner.findOne({
                where: {
                    phoneNumber: body.phoneNumber,
                },
            });
            await redisClient.setEx(
                `partner:${body.phoneNumber}:otp`,
                360,
                otp
            );
            // await this._africasTalkingClient.sendSMS(
            //   [phoneNumber],
            //   `Your OTP from BIKO Mechanic is : ${otp}`
            // );
            if (partner) {
                res.status(200).json({ message: 'success' });
            } else {
                res.status(200).json({ message: 'not allowed' });
                // const newPartner = new Partner();
                // newPartner.phoneNumber = body.phoneNumber;
                // await newPartner.save();
                // res.status(201).json({ message: 'success' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    phoneNumberVerification: RequestHandler = async (req, res, next) => {
        const body = req.body as {
            otp: string;
            phoneNumber: string;
        };
        try {
            const value = await redisClient.get(
                `partner:${body.phoneNumber}:otp`
            );
            if (value) {
                if (body.otp === value) {
                    const partner = await Partner.findOne({
                        where: {
                            phoneNumber: body.phoneNumber,
                        },
                        relations: ['individualDetails', 'companyDetails'],
                    });
                    const accessToken = generateAccessToken({
                        uuid: partner.uuid,
                        accountType: 'partner',
                    });
                    res.json({
                        message: 'success',
                        accessToken,
                        uuid: partner.uuid,
                        phoneNumber: partner.phoneNumber,
                    });
                } else {
                    res.json({ message: 'incorrect otp' });
                }
            } else {
                res.json({ message: 'otp not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    createPartner: RequestHandler = async (req, res, next) => {
        const body = req.body as {
            phoneNumber: string;
            services: string[];
            partnerType: string;
        };
        try {
            const partner = new Partner();
            partner.phoneNumber = body.phoneNumber;
            partner.services = body.services;
            partner.partnerType = body.partnerType;
            await partner.save();
            res.status(201).json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };
}

export default PartnersController;
