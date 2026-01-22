const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    carRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarRequest",
      required: true,
    },

    razorpay_order_id: {
      type: String,
      required: true,
    },

    razorpay_payment_id: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["ADVANCE", "REMAINING"],
      required: true,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
