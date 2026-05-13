const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.loginUser(
            email, password, req.headers['user-agent'], req.ip
        );

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NOODE_ENV === "production",
            sameSite: "strict"
        });

        res.json({
            accessToken: result.accessToken
        });

    } catch (error) {
        next(error);
    }
    
};

exports.refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const result = await authService.refreshUserToken(
            refreshToken
        );

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict"
        });

        res.json({
            accessToken: result.accessToken
        });

    } catch (error) {
        next(error);
    }

};

exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        await authService.logoutCurrentDevice(
            refreshToken
        );

        res.clearCookie('refreshToken');

        res.json({
            message: "Logout successfully"
        });

    } catch (error) {
        next(error);
    }
    
};

exports.logoutAll = async (req,res, next) => {
    try {
        await authService.logoutAllDevices(
            req.user.id
        );

        res.clearCookie('refreshToken');

        res.json({
            message: "Logged out from all devices"
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        const hashedToken = crypto
        .createhash('sha56')
        .update(token)
        .digest('hex');

        const user = await User.findOne({
            where: {
                emailVerificationToken: hashedToken
            }
        });

        if (!user) {
            throw new Error('Invalid token');
        }

        if (new Date() > user.emailVerificationExpires) {
            throw new Error('Token Expired');
        }

        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;

        await user.save();

        res.json({
            message: 'Email verified successfully'
        });

    } catch (error) {
        next(error);
    }
};