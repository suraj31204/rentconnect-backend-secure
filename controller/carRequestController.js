// controllers/carRequestController.js
const CarRequest = require("../model/carRequestModel");
const Driver = require("../model/driverInfoModel");
const Car = require("../model/carInfoModel");

/* =========================================================
   REQUEST CAR (Driver)
========================================================= */
const requestCar = async (req, res) => {
  try {
    const { driverId, carId, rental_days = 0, rental_months = 0 } = req.body;

    if (!driverId || !carId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (!car.owner) {
      return res.status(400).json({ message: "Car owner not assigned" });
    }

    // 🔥 Calculate totalAmount upfront
    const totalAmount =
      (Number(car.price_per_day) || 0) * Number(rental_days) +
      (Number(car.price_per_month) || 0) * Number(rental_months);

    const request = await CarRequest.create({
      driverId,
      carId,
      carOwnerId: car.owner,
      price_per_day: car.price_per_day || 0,
      price_per_month: car.price_per_month || 0,
      rental_days: Number(rental_days),
      rental_months: Number(rental_months),
      totalAmount,
      status: "PENDING",
    });

    // Store request ID in Driver document
    await Driver.findByIdAndUpdate(driverId, {
      $push: { requestedCarRequests: request._id },
    });

    res.status(201).json({
      message: "Car request sent successfully",
      request,
    });
  } catch (err) {
    console.error("❌ requestCar error:", err);
    res.status(500).json({ message: "Request failed" });
  }
};

/* =========================================================
   ACCEPT REQUEST
========================================================= */
const acceptCarRequest = async (req, res) => {
  try {
    const updatedRequest = await CarRequest.findByIdAndUpdate(
      req.params.id,
      { status: "ACCEPTED" },
      { new: true }
    )
      .populate("driverId")
      .populate("carId");

    res.json(updatedRequest);
  } catch (error) {
    console.error("❌ acceptCarRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   REJECT REQUEST
========================================================= */
const rejectCarRequest = async (req, res) => {
  try {
    const updatedRequest = await CarRequest.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true }
    )
      .populate("driverId")
      .populate("carId");

    res.json(updatedRequest);
  } catch (error) {
    console.error("❌ rejectCarRequest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET ALL REQUESTS (ADMIN)
========================================================= */
const getAllRequests = async (req, res) => {
  try {
    const requests = await CarRequest.find()
      .populate("driverId")
      .populate("carId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("❌ getAllRequests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET REQUESTS BY DRIVER
========================================================= */
const getRequestsByDriver = async (req, res) => {
  try {
    const requests = await CarRequest.find({ driverId: req.params.driverId })
      .populate(
        "carId",
        "carNumber modelNo fuelType seatCapacity carColour carLocation carImages price_per_day price_per_month"
      )
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("❌ getRequestsByDriver error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET REQUESTS BY CAR OWNER
========================================================= */
const getRequestsByCarOwner = async (req, res) => {
  try {
    const { carOwnerId } = req.params;

    if (!carOwnerId) {
      return res.status(400).json({ message: "Car Owner ID is required" });
    }

    const requests = await CarRequest.find({ carOwnerId })
      .populate("driverId")
      .populate("carId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("❌ getRequestsByCarOwner error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  requestCar,
  acceptCarRequest,
  rejectCarRequest,
  getAllRequests,
  getRequestsByDriver,
  getRequestsByCarOwner,
};
