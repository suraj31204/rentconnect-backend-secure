const express = require("express");
const Router = express.Router();
const multer = require("multer");
const driverController = require("../controller/driverInfoController");

/* ======================================================
   MULTER CONFIG
   ====================================================== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadsDrivers/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadsDriver = multer({ storage });

/* ======================================================
   CREATE
   ====================================================== */
Router.post(
  "/",
  uploadsDriver.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProofImage", maxCount: 1 },
  ]),
  driverController.driverInfoHandler
);

/* ======================================================
   GET ALL
   ====================================================== */
Router.get("/", driverController.getAllDrivers);

/* ======================================================
   GET BY USER
   ====================================================== */
Router.get("/by-user/:userId", driverController.getDriverByUser);

/* ======================================================
   UPDATE
   ====================================================== */
Router.put(
  "/update/:id",
  uploadsDriver.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProofImage", maxCount: 1 },
  ]),
  driverController.updateDriver
);

module.exports = Router;
