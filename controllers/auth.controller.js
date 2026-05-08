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
            secure: false,
            sameSite: "strict"
        });

        res.json({
            accessToken: result.accessToken
        });

    } catch (error) {
        next(error);
    }
    
};