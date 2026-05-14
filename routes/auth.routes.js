const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginScema } = require('../validators/auth.validator')

router.post('/register', validate(registerSchema), authLimiter, authController.register);
router.post('/login', validate(loginScema), authLimiter, authController.login);

router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);

module.exports = router;