const crypto = require('crypto');
const { User } = require('../models');
const emailService = require('../services/email.services');

exports.forgetPassword = async (req, res) => {
    try{
        const user = await User.findOne({
            where: {emil: req.body.email}
        });

        if (!user) {
            throw new Error('User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.passwordResetToken = hashedToken;

        user.passwordResetExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        await emailService.sendEmail(
            user.email,
            "Password Reset",
            `Your reset token: ${resetToken}`
        );

        res.json({
            message: "Reset email sent"
        });
    } catch (error){
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const {token, newPassword } = req.body;

        const hashedToken = crypto
        .createHash('shas256')
        .update(token)
        .digest('hex');

        const user = await user.findOne({
            where: {passwordResetToken: hashedToken}
        });

        if (!user) {
            throw new Error('Invalid token');
        }

        if (new Date() > user.passwordResetExpires) {
            throw new Error('Token expired');
        }

        user.password = newPassword;

        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();

        res.json({
            message: "Password Reset Successful"
        });
    } catch (error) {
        next(error);
    }
};