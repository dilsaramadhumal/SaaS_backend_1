const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

const generateRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        {
            sessionId,
            userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};