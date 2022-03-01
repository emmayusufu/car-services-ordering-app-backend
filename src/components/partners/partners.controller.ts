import { RequestHandler } from 'express';
import { Partner } from '../../database/entities/partners.entity';
import { generateOTP } from '../../utils/helpers';
import { redisClient } from '../../utils/redis_client';
import AfricasTalkingClient from '../../utils/africastalking-client';
import { generateAccessToken } from '../../utils/jwt_authentication';
import clc from 'cli-color';
import { logger } from '../../utils/logger';
import { Individual } from '../../database/entities/individuals.entity';
import { Company } from '../../database/entities/companies.entity';

class PartnersController {
    private _africasTalkingClient = AfricasTalkingClient.getInstance();

    getAll: RequestHandler = async (_req, res, next) => {
        try {
            const redisUsersData = await redisClient.json.get('users', {
                path: '.partners',
            });

            if (redisUsersData) {
                const partners = JSON.parse(redisUsersData as string);

                res.json(partners);
            } else {
                const partners = await Partner.find({
                    relations: ['individualDetails', 'companyDetails'],
                });
                await redisClient.json.set('users', '.', {
                    partners: JSON.stringify(partners),
                });

                res.status(200).json(partners);
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    streamOnlinePartners: RequestHandler = async (_req, res, _next) => {
        const headers = {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
        };
        res.writeHead(200, headers);

        const interval = setInterval(async () => {
            const onlinePartnersUuids = await redisClient.sMembers(
                'onlinePartnersUuids'
            );
            const data = `data: ${JSON.stringify(onlinePartnersUuids)}\n\n`;

            res.write(`data: ${data}\n\n`);
        }, 4000);

        res.on('close', () => {
            clearInterval(interval);
        });
    };

    streamPartnersLocation: RequestHandler = async (req, res, _next) => {
        const params = req.params as { uuid: string };
        const uuid = params.uuid;

        const interval = setInterval(async () => {
            const data = await redisClient.hGet('partnerLocations', uuid);

            const locationCoordinates = `data: ${JSON.stringify(data)}\n\n`;

            res.write(`data: ${locationCoordinates}\n\n`);
        }, 4000);

        req.on('close', () => {
            clearInterval(interval);
        });
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
            generalDetails: {
                phoneNumber: string;
                partnerType: string;
                services: string[];
            };
            companyDetails?: {
                companyName: string;
            };
            individualDetails?: {
                firstName: string;
                lastName: string;
            };
        };
        try {
            if (body.generalDetails.partnerType === 'Individual') {
                const partner = new Partner();
                const individual = new Individual();
                individual.firstName = body.individualDetails.firstName;
                individual.lastName = body.individualDetails.lastName;

                await individual.save();

                await individual.reload();

                partner.partnerType = body.generalDetails.partnerType;
                partner.services = body.generalDetails.services;
                partner.phoneNumber = body.generalDetails.phoneNumber;
                partner.individualDetails = individual;
                await partner.save();
                res.status(201).json({ message: 'success' });
            } else if (body.generalDetails.partnerType === 'Company') {
                const partner = new Partner();
                const company = new Company();
                company.companyName = body.companyDetails.companyName;
                await company.save();

                await company.reload();

                partner.partnerType = body.generalDetails.partnerType;
                partner.services = body.generalDetails.services;
                partner.phoneNumber = body.generalDetails.phoneNumber;
                partner.companyDetails = company;
                await partner.save();
                res.status(201).json({ message: 'success' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };
}

export default PartnersController;
