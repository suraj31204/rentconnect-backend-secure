const mongoose = require('mongoose');

const carInfoSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  carNumber: { type: String, required: true, unique: true },
  fuelType: {
    type: String,
    required: true,
    enum: ["CNG", "Petrol", "Diesel", "Petrol/CNG", "Electric", "Hybrid"]
  },
  modelNo: { type: String, required: true },
  seatCapacity: { type: Number, required: true, min: 1 },
  registrationDate: { type: Date, required: true },
  carColour: { type: String, required: true },
  carLocation: {type: String, required: true },

  carImages: [{ type: String }],


  price_per_day: { type: Number, required: true },
  price_per_month: { type: Number, required: true },

  // banking 
  
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifsc: String,
    bankName: String
  },

}, { timestamps: true });

module.exports = mongoose.model("Car", carInfoSchema);
