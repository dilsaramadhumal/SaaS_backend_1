const joi = require('joi');

exports.productScema = joi.object({
    name: joi.string().required(),
    description: joi.string().allow(''),
    price: joi.number().positive().required()
});