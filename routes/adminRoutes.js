const express = require("express");
const router = express.Router();
const adminPaymentController = require("../controller/adminPaymentController");
const CarRequest = require("../model/carRequestModel");

/* =======================
   GET ALL REQUESTS (FIX)
======================= */
router.get("/requests", async (req, res) => {
  try {
    const requests = await CarRequest.find()
      .populate({
        path: "carId",
        populate: { path: "owner" }
      })
      .populate("driverId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Admin requests error:", err);
    res.status(500).json({ message: "Failed to load requests" });
  }
});

/* =======================
   TEMP RELEASE LOGIC
======================= */
router.post("/release-advance/:id", adminPaymentController.releaseAdvance);
router.post("/release-remaining/:id", adminPaymentController.releaseRemaining);

module.exports = router;
