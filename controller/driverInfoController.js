const Driver = require("../model/driverInfoModel");

/* ================= CREATE ================= */
exports.driverInfoHandler = async (req, res) => {
  try {
    const sessionUserId = req.session?.user?._id;
    if (!sessionUserId) {
      return res.status(401).json({ error: "Login required" });
    }

    const newDriver = new Driver({
      driverId: sessionUserId,
      name: req.body.fullName || req.body.name,
      email: req.body.email,
      address: req.body.address,
      license: req.body.license,
      idProof: req.body.idProof,
      idProofImage: req.files?.idProofImage
        ? `uploadsDrivers/${req.files.idProofImage[0].filename}`
        : "",
      experience: req.body.experience,
      previousWork: req.body.previousWork,
      preferredRoutes: req.body.preferredRoutes,
      emergencyContact: req.body.emergencyContact,
      photo: req.files?.photo
        ? `uploadsDrivers/${req.files.photo[0].filename}`
        : "",
    });

    const saved = await newDriver.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllDrivers = async (req, res) => {
  const driversData = await Driver.find();
  res.status(200).json(driversData);
};

/* ================= GET BY USER ================= */
exports.getDriverByUser = async (req, res) => {
  try {
    const driver = await Driver.findOne({ driverId: req.params.userId });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE ================= */
exports.updateDriver = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.files?.photo) {
      updateData.photo = `uploadsDrivers/${req.files.photo[0].filename}`;
    }

    if (req.files?.idProofImage) {
      updateData.idProofImage = `uploadsDrivers/${req.files.idProofImage[0].filename}`;
    }

    const updated = await Driver.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
