const CarRequest = require("../model/carRequestModel");
const Car = require("../model/carInfoModel");

/**
 * ===============================
 * RELEASE ADVANCE (10%)
 * ===============================
 */
exports.releaseAdvance = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await CarRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!request.advancePaid) {
      return res.status(400).json({ message: "Advance not paid by driver" });
    }

    if (request.adminReleasedAdvance) {
      return res.status(400).json({ message: "Advance already released" });
    }

    // ✅ ENSURE totalAmount EXISTS (for old records)
    if (!request.totalAmount) {
      const car = await Car.findById(request.carId);

      request.totalAmount =
        (request.rental_days || 0) * (car.price_per_day || 0) +
        (request.rental_months || 0) * (car.price_per_month || 0);
    }

    // ✅ VALID SCHEMA UPDATES
    request.adminReleasedAdvance = true;
    request.adminAdvanceReleasedAt = new Date();
    request.adminAdvanceAmount = Math.round(request.totalAmount * 0.1);
    request.paymentStatus = "ADVANCE_PAID";

    await request.save();

    res.json({
      success: true,
      message: "Advance released successfully",
    });
  } catch (error) {
    console.error("Release advance error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * ===============================
 * RELEASE REMAINING (90%) ✅ FIXED
 * ===============================
 */
exports.releaseRemaining = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await CarRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ✅ Driver must have paid remaining amount
    if (!request.remainingPaid) {
      return res.status(400).json({ message: "Remaining amount not paid" });
    }

    // ✅ Admin must not have already released
    if (request.adminRemainingReleasedAt) {
      return res.status(400).json({ message: "90% already released" });
    }

    // ✅ ENSURE totalAmount EXISTS (for old records)
    if (!request.totalAmount) {
      const car = await Car.findById(request.carId);

      request.totalAmount =
        (request.rental_days || 0) * (car.price_per_day || 0) +
        (request.rental_months || 0) * (car.price_per_month || 0);
    }

    // ✅ VALID SCHEMA UPDATES
    request.adminRemainingReleasedAt = new Date();
    request.paymentStatus = "FULLY_PAID";

    await request.save();

    res.json({
      success: true,
      message: "Remaining amount released successfully",
    });
  } catch (error) {
    console.error("Release remaining error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
