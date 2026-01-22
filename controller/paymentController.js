const Razorpay = require("razorpay");
const crypto = require("crypto");
const CarRequest = require("../model/carRequestModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   CREATE ORDER
========================= */
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    console.error("❌ createOrder error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* =========================
   VERIFY PAYMENT (ADVANCE + REMAINING)
========================= */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      carRequestId,
      type,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    /* ===== ADVANCE PAYMENT ===== */
    if (type === "ADVANCE") {
      await CarRequest.updateOne(
        { _id: carRequestId },
        {
          $set: {
            advancePaid: true,
            paymentStatus: "ADVANCE_PAID",
          },
        }
      );
    }

    /* ===== REMAINING PAYMENT ===== */
    if (type === "REMAINING") {
      await CarRequest.updateOne(
        { _id: carRequestId },
        {
          $set: {
            remainingPaid: true,
            ownerFullyPaid: true,
            paymentStatus: "FULLY_PAID",
            status: "ACTIVE",
          },
        }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ verifyPayment error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
