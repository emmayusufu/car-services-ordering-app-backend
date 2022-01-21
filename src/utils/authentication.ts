import jwt from 'jsonwebtoken';

const generateJWTToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            _id: user._id,
        },
        process.env.JWT_SECRET_KEY
    );
};

const decodeJWT = (jwtString) => {
    return jwt.verify(jwtString, process.env.jwt_secret);
};

export { generateJWTToken, decodeJWT };
