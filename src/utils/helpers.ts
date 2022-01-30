import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../interfaces/interfaces';

const generateOTP = () => {
    const length = 6;
    var randomChars = '123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(
            Math.floor(Math.random() * randomChars.length)
        );
    }
    return result;
};

const generateAccessToken = (data: { uuid: string }) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
};

const authenticateToken = (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        (err: any, user: any) => {
            console.log(err);

            if (err) return res.sendStatus(403);

            req.user = user;

            next();
        }
    );
};

export { generateOTP, generateAccessToken, authenticateToken };
