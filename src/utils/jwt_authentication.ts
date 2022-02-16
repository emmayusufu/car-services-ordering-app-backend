import { Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../interfaces/interfaces';

const generateAccessToken = (data: { uuid: string; accountType: string }) => {
    const payLoad = {
        sub: data.uuid,
        accountType: data.accountType,
        iat: Math.floor(Date.now() / 1000) - 30,
    };
    return jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET as string);
};

const generateRefreshToken = (data: { uuid: string }) => {
    const payLoad = {
        sub: data.uuid,
        iat: Math.floor(Date.now() / 1000) - 30,
    };
    return jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET as string);
};

const authenticateAccessToken = (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null)
        return res.status(401).json({ message: 'no_token_received' });

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: any, data: { sub: string; accountType: string }) => {
            if (err instanceof TokenExpiredError) {
                return res.status(403).send({
                    message: 'token_expired',
                });
            }
            req.user = {
                uuid: data.sub,
                accountType: data.accountType,
            };
            next();
        }
    );
};

const verifyRefreshToken = (
    token: string
): Promise<{ message: string; uuid: string }> => {
    return new Promise((resolve, reject) =>
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string,
            (err: any, data: { sub: string; accountType: string }) => {
                if (err instanceof TokenExpiredError) {
                    reject({ message: 'token_expired' });
                }
                resolve({ message: 'success', uuid: data.sub });
            }
        )
    );
};

export {
    generateAccessToken,
    generateRefreshToken,
    authenticateAccessToken,
    verifyRefreshToken,
};
