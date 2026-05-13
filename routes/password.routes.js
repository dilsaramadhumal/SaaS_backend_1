const express = require("express");
const router = express.Router();

const { authLimiter } = require("../middleware/ratelimit.middleware");
const { forgetPassword, resetPassword } = require("../controllers/password.controller");

router.post("/forget-password", authLimiter, forgetPassword);
router.post("/reset-password", authLimiter, resetPassword);

module.exports = router;