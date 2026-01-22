const mongoose = require("mongoose");

const carRequestSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    carOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price_per_day: Number,
    price_per_month: Number,
    rental_days: Number,
    rental_months: Number,

    // ✅ FIX: add ACTIVE (required for payment flow)
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "ACTIVE", "REJECTED"],
      default: "PENDING",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "ADVANCE_PAID", "FULLY_PAID"],
      default: "PENDING",
    },

    advancePaid: { type: Boolean, default: false },
    remainingPaid: { type: Boolean, default: false },

    adminReleasedAdvance: { type: Boolean, default: false },
    ownerFullyPaid: { type: Boolean, default: false },

    rentalStartDate: Date,
    rentalEndDate: Date,

    adminAdvanceReleasedAt: Date,
    adminRemainingReleasedAt: Date,

    adminAdvanceAmount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarRequest", carRequestSchema);
