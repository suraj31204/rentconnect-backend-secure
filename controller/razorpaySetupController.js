const razorpay = require("../config/razorpay");
const User = require("../model/userModel");

exports.createContactAndFundAccount = async (req, res) => {
  try {
    const userId = req.user._id; // owner logged in
    const user = await User.findById(userId);

    if (!user.bankDetails) {
      return res.status(400).json({ message: "Bank details missing" });
    }

    // 🔹 CREATE CONTACT
    if (!user.razorpayContactId) {
      const contact = await razorpay.contacts.create({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        type: "vendor",
        reference_id: user._id.toString(),
      });

      user.razorpayContactId = contact.id;
    }

    // 🔹 CREATE FUND ACCOUNT (✅ FIXED)
    if (!user.razorpayFundAccountId) {
      const fundAccount = await razorpay.fundAccounts.create({
        contact_id: user.razorpayContactId,
        account_type: "bank_account",
        bank_account: {
          name: user.bankDetails.accountHolderName,
          ifsc: user.bankDetails.ifsc,
          account_number: user.bankDetails.accountNumber,
        },
      });

      user.razorpayFundAccountId = fundAccount.id;
    }

    await user.save();

    res.json({
      success: true,
      fundAccountId: user.razorpayFundAccountId,
    });
  } catch (error) {
    console.error("Razorpay Setup Error:", error);
    res.status(500).json({
      message: error?.error?.description || "Razorpay setup failed",
    });
  }
};