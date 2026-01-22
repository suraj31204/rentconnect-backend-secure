const razorpay = require("../config/razorpay");
const CarRequest = require("../model/carRequestModel");

exports.releaseAdvance = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ CORRECT POPULATION
    const request = await CarRequest.findById(id).populate({
      path: "carId",
      populate: {
        path: "owner", // <-- THIS IS IMPORTANT
      },
    });

    if (!request) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!request.advancePaid) {
      return res.status(400).json({ message: "Advance not paid by driver" });
    }

    if (request.adminReleasedAdvance) {
      return res.status(400).json({ message: "Advance already released" });
    }

    const owner = request.carId.owner;

    if (!owner || !owner.razorpayFundAccountId) {
      return res.status(400).json({
        message: "Car owner bank account not linked with Razorpay",
      });
    }

    // ✅ CORRECT AMOUNT CALCULATION
    const totalAmount =
      (request.rental_days || 0) * (request.carId.price_per_day || 0) +
      (request.rental_months || 0) * (request.carId.price_per_month || 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const advanceAmount = Math.round(totalAmount * 0.1);

    // 🔥 RAZORPAY PAYOUT (TEST MODE OR LIVE MODE)
    const payout = await razorpay.payouts.create({
      account_number: process.env.RAZORPAY_VIRTUAL_ACCOUNT,
      fund_account_id: owner.razorpayFundAccountId,
      amount: advanceAmount * 100, // paisa
      currency: "INR",
      mode: "IMPS",
      purpose: "payout",
      narration: `Advance payout for booking ${request._id}`,
    });

    // ✅ UPDATE DB AFTER SUCCESSFUL PAYOUT
    request.adminReleasedAdvance = true;
    request.adminAdvanceReleasedAt = new Date();
    request.adminAdvanceAmount = advanceAmount;
    request.status = "ACTIVE";

    await request.save();

    res.json({
      success: true,
      payoutId: payout.id,
      amount: advanceAmount,
    });
  } catch (error) {
    console.error("PAYOUT ERROR:", error);
    res.status(500).json({
      message: error?.error?.description || "Payout failed",
    });
  }
};
