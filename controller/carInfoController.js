const Car = require("../model/carInfoModel");
const mongoose = require("mongoose");

exports.carInfoHandler = async (req, res) => {
  try {
    const {
      owner,
      carNumber,
      fuelType,
      modelNo,
      seatCapacity,
      registrationDate,
      carColour,
      carLocation, // ✅ ADDED
      price_per_day,
      price_per_month
    } = req.body;

    const newCar = new Car({
      owner,
      carNumber,
      fuelType,
      modelNo,
      seatCapacity,
      registrationDate,
      carColour,
      carLocation, // ✅ ADDED
      carImages: req.files.map(file => `uploads/${file.filename}`),
      price_per_day,
      price_per_month
    });

    await newCar.save();

    res.status(201).json({
      message: "Car added successfully",
      car: newCar
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("owner", "firstName lastName");
    res.status(200).json(cars);
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
};


exports.getCarsByOwner = async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.params.ownerId });
    res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching owner cars:", error);
    res.status(500).json({ error: "Failed to fetch owner cars" });
  }
};
