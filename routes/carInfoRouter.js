const express = require("express");
const multer = require("multer");
const router = express.Router();
const carController = require("../controller/carInfoController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/", upload.array("carImages", 10), carController.carInfoHandler);

/* ✅ GET BY ID MUST COME FIRST */
router.get("/:id", carController.getCarById);

/* ✅ THEN OWNER */
router.get("/owner/:ownerId", carController.getCarsByOwner);

/* ALL */
router.get("/", carController.getAllCars);

router.put("/:id", carController.updateCar);
router.delete("/:id", carController.deleteCar);

module.exports = router;
