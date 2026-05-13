const joi = require('joi');

exports.registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

exports.loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});