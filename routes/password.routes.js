const express = require("express");
const router = express.Router();

router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

module.exports = router;