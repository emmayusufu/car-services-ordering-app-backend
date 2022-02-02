import { RequestHandler } from 'express';
import { Client } from '../../database/entities/clients.entity';
import { AccountType, ProfileSetup } from '../../enums/enums';
import { generateOTP } from '../../utils/helpers';
import { redisClient } from '../../utils/redis_client';
import AfricasTalkingClient from '../../utils/africastalking-client';
import { getIO } from '../../utils/socket_io';
import { generateAccessToken } from '../../utils/jwt_authentication';

class ClientsController {
    private _africasTalkingClient = AfricasTalkingClient.getInstance();

    getAll: RequestHandler = async (_req, res, next) => {
        try {
            const clients = await Client.find({
                where: { profileSetup: ProfileSetup.COMPLETE },
            });
            res.status(200).json(clients);
        } catch (error) {
            if (error instanceof Error) {
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
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    continueWithPhoneNumber: RequestHandler = async (req, res, next) => {
        const { phoneNumber } = req.body as { phoneNumber: string };
        const otp = generateOTP();
        try {
            const client = await Client.findOne({ phoneNumber });

            await redisClient.setEx(`client:${phoneNumber}:otp`, 600, otp);
            console.log('mobile otp', parseInt(otp));
            // await this._africasTalkingClient.sendSMS(
            //     [phoneNumber],
            //     `Your OTP from Biko Mechanic is : ${otp}`
            // );
            if (client) {
                res.status(200).json({
                    message: 'success',
                });
            } else {
                const newClient = new Client();
                newClient.phoneNumber = phoneNumber;
                await newClient.save();
                res.status(201).json({
                    message: 'success',
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    phoneNumberVerification: RequestHandler = async (req, res, next) => {
        const { otp, phoneNumber } = req.body as {
            otp: string;
            phoneNumber: string;
        };
        try {
            const value = await redisClient.get(`client:${phoneNumber}:otp`);
            if (value) {
                if (otp === value) {
                    const client = await Client.findOne({
                        where: { phoneNumber: phoneNumber },
                    });
                    if (client) {
                        switch (client.profileSetup) {
                            case ProfileSetup.PENDING:
                                await redisClient.del(
                                    `client:${phoneNumber}:otp`
                                );
                                res.status(200).json({
                                    message: 'profile_setup_pending',
                                    uuid: client.uuid,
                                });
                                break;
                            case ProfileSetup.COMPLETE:
                                await redisClient.del(
                                    `client:${phoneNumber}:otp`
                                );
                                const accessToken = generateAccessToken({
                                    uuid: client.uuid,
                                });
                                res.status(200).json({
                                    message: 'profile_setup_complete',
                                    accessToken,
                                    firstName: client.firstName,
                                    lastName: client.lastName,
                                    phoneNumber: client.phoneNumber,
                                });
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    res.status(403).json({ message: 'incorrect otp' });
                }
            } else {
                res.status(404).json({ message: 'otp not found' });
            }
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    profileSetup: RequestHandler = async (req, res, next) => {
        const { uuid } = req.params as { uuid: string };
        const { firstName, lastName } = req.body;
        try {
            const client = await Client.findOne({ uuid });
            if (!client) return;
            (client.firstName = firstName),
                (client.lastName = lastName),
                (client.profileSetup = ProfileSetup.COMPLETE);
            await client.save();
            const adminSocketId = await redisClient.get('adminSocketId');
            getIO().to(adminSocketId).emit('newClient', client);
            const accessToken = generateAccessToken({
                uuid: client.uuid,
            });
            res.status(200).json({
                accessToken,
                firstName: client.firstName,
                lastName: client.lastName,
                phoneNumber: client.phoneNumber,
            });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    reIssueAccessToken: RequestHandler = async (req, res, next) => {
        const { refreshToken } = req.body;
        try {
            res.json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };

    resendOTP: RequestHandler = async (req, res, next) => {
        const { phoneNumber } = req.body;
        const otp = generateOTP();
        try {
            await redisClient.setEx(`client:${phoneNumber}:otp`, 300, otp);
            res.json({ message: 'success' });
        } catch (error) {
            if (error instanceof Error) {
                next(new Error(error.message));
            }
        }
    };
}

export default ClientsController;
