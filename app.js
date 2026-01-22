// Core Modules
const path = require("path");

// External Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const chatbotRoutes = require("./routes/chatbotRoutes");


// Env
require("dotenv").config();

// Local Modules
const carRouter = require("./routes/carInfoRouter");
const driverRouter = require("./routes/driverInfoRouter");
const authRouter = require("./routes/authRouter");
const carRequestRouter = require("./routes/carRequestRouter");

const app = express();

// 🔥 REQUIRED FOR RENDER
const PORT = process.env.PORT || 2000;
const DB_URL = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ CORS (LOCAL + VERCEL FRONTEND)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://rentconnect-frontend.vercel.app"
  ],
  credentials: true
}));

// Session Store
const store = new MongoDBStore({
  uri: DB_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploadsDrivers",
  express.static(path.join(__dirname, "uploadsDrivers"))
);

// Routes
app.use("/api/carInfo", carRouter);
app.use("/api/driver", driverRouter);
app.use("/api/auth", authRouter);
app.use("/api/carRequest", carRequestRouter);

// Banking
app.use("/api/payment", require("./routes/paymentRoutes"));

// Admin
app.use("/api/admin", require("./routes/adminRoutes"));

// Chatbot
app.use("/api", chatbotRoutes);


// DB + Server Start
mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
