const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Session } = require('../models');
const sequelize = require('../config/db');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/token');
const { IncomingMessage } = require('http');

const emailService = require('./email.service');

exports.registerUser = async (data) => {
    const transaction = await sequelize.transaction();

    try{

        const user = await User.create(data, { transaction });

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex')

        user.emailVerificationToken = hashedToken;

        user.emailVerificationExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save({ transaction });

        await emailService.sendEmail(
            user.email,
            'Verify Email',
            `Your verification token: ${verificationToken}`
        );

        await transaction.commit();
        return user;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
    
};

exports.loginUser = async (email , password, deviceInfo, ipAddress) => {
    const transaction = await sequelize.transaction();

    try{
        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isVerified) {
            throw new Error("Please verify your email first")
        }

        const validPassword = await user.comparePassword(password);

        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const session = await Session.create(
            {
                userId: user.id,
                refreshTokenHash: 'temp',
                deviceInfo,
                ipAddress,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                absoluteExpiresAt: new Date(
                    date.now() + 30 * 24 * 60 * 60 * 1000
                )
            },
            { transaction }
        );

        const refreshToken = generateRefreshToken(user.id, session.id);
        const hashedRefresh = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest("hex");

        session.refreshTokenhash = hashedRefresh;
        await session.save({ transaction });

        const accessToken = generateAccessToken(user);

        await transaction.commit();

        return {
            user,
            accessToken,
            refreshToken
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
                          
};

exports.refreshUserToken = async (refreshToken) => {
    const transaction = await sequelize.transaction();

    try {
        if(!refreshToken) {
            throw new Error('no refresh Token');
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );

        const session = await Session.findByPk(
            decoded.sessionId,
            { transaction }
        );

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.isRevoked) {
            throw new Error('Session revoked');
        }

        //abssolute expiration check
        if(new Date() > session.absoluteExpiresAt) {
            throw new Error('Session expired permanantly');
        }

        const incomgHash = crypto
        .createHash('sha256')
        .update(efreshToken)
        .digest('hex');

        if (IncomingHash !== session.refreshTokenhash) {
            throw new Error('Refresh tokenmismatch');
        }

        //gnerate new refresh token
        const newRefreshToken = generateRefreshToken(
            session.id,
            session.userId
        )

        const newHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

        sesion.refreshTkenHash = newHash;
        session.expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await session.save(transaction);

        const user = await User.findByPk(session.userId);
        const accessToken = generateAccessToken(user);
        await transaction.commit();

        return {
            acccessToken,
            refreshToken: newRefreshToken
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.logoutCurrentDevice = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error('No refesf token provided');
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
    );

    await Session.destroy({
        where: {
            id: decoded.sesssionId
        }
    });

    return true;
}

//logout all devices
exports.logoutAllDevices = async (userId) => {
    await Session.destroy({
        where: {userId}
    });

    return true;

};