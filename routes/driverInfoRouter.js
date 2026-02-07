const express = require("express");
const Router = express.Router();
const multer = require("multer");
const Driver = require("../model/driverInfoModel");
const driverController = require("../controller/driverInfoController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadsDrivers/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadsDriver = multer({ storage });

/* CREATE DRIVER PROFILE */
Router.post(
  "/",
  uploadsDriver.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProofImage", maxCount: 1 },
  ]),
  driverController.driverInfoHandler
);

/* GET ALL DRIVERS */
Router.get("/", driverController.getAllDrivers);

/* GET DRIVER BY USER */
Router.get("/by-user/:userId", driverController.getDriverByUser);

/* 🔥 UPDATE DRIVER */
Router.put(
  "/update/:id",
  uploadsDriver.fields([
    { name: "photo", maxCount: 1 },
    { name: "idProofImage", maxCount: 1 },
  ]),
  driverController.updateDriver
);

module.exports = Router;
