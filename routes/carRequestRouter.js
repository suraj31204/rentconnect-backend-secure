const express = require("express");
const router = express.Router();

const {
  requestCar,
  acceptCarRequest,
  rejectCarRequest,
  getAllRequests,
  getRequestsByDriver,
  getRequestsByCarOwner // ✅ new
} = require("../controller/carRequestController");

router.post("/request", requestCar);
router.post("/accept/:id", acceptCarRequest);
router.post("/reject/:id", rejectCarRequest);

// Get all requests (admin / driver view)
router.get("/", getAllRequests);

// Get requests by driver
router.get("/driver/:driverId", getRequestsByDriver);

// Get requests by Car Owner
router.get("/owner/:carOwnerId", getRequestsByCarOwner); // ✅ new

module.exports = router;
