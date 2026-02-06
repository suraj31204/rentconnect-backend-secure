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
router.get("/", carController.getAllCars);

/* ✅ NEW – GET CARS BY OWNER */
router.get("/owner/:ownerId", carController.getCarsByOwner);

router.put("/:id", carController.updateCar);
router.delete("/:id", carController.deleteCar);
router.get("/:id", carController.getCarById);

module.exports = router;
