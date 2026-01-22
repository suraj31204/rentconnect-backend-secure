const express = require("express");
const router = express.Router();
const { createContactAndFundAccount } = require("../controller/razorpaySetupController");
const auth = require("../middleware/auth");

router.post("/setup-bank", auth, createContactAndFundAccount);

module.exports = router;
