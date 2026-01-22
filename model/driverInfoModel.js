const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  // reference to authenticated User
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  license: { type: String, required: true },
  idProof: { type: String, required: true },
  idProofImage: { type: String, required: true },
  experience: { type: String, required: true },
  previousWork: { type: String, required: true },
  preferredRoutes: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  photo: { type: String, required: true },

  // ✅ NEW (does NOT break anything)
  requestedCarRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CarRequest" }
  ],

  receivedCarRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CarRequest" }
  ]

}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
