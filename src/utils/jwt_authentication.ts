import { Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../interfaces/interfaces';

const generateAccessToken = (data: { uuid: string; accountType: string }) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
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
        process.env.TOKEN_SECRET as string,
        (err: any, data: { uuid: string; accountType: string }) => {
            if (err instanceof TokenExpiredError) {
                return res.status(401).send({
                    message: 'token_expired',
                });
            }
            req.user = {
                uuid: data.uuid,
                accountType: data.accountType,
            };
            next();
        }
    );
};

export { generateAccessToken, authenticateAccessToken };
