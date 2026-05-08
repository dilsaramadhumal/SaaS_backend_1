const crypto = require('crypto');
const bcrypt = require('bcrypt'); 
const { User, Session } = require('../models');
const sequelize = require('../config/db');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/token');

exports.registerUser = async (data) => {
    const transaction = await sequelize.transaction();

    try{
        const user = await User.create(data, { transaction });

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