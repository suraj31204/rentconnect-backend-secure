const express = require('express');
const Router = express.Router();
const multer = require('multer');
const Driver = require('../model/driverInfoModel');
const driverController = require('../controller/driverInfoController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploadsDrivers/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadsDriver = multer({ storage });

/* CREATE DRIVER PROFILE */
Router.post(
  '/',
  uploadsDriver.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'idProofImage', maxCount: 1 }
  ]),
  driverController.driverInfoHandler
);

/* GET ALL DRIVERS */
Router.get('/', driverController.getAllDrivers);

/* ✅ GET DRIVER BY USER ID (REQUIRED) */
Router.get('/by-user/:userId', async (req, res) => {
  try {
    const driver = await Driver.findOne({ driverId: req.params.userId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = Router;
