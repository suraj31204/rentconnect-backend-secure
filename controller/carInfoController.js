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


exports.updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: "Failed to update car" });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete car" });
  }
};


exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    res.json(car);
  } catch (err) {
    res.status(404).json({ error: "Car not found" });
  }
};
