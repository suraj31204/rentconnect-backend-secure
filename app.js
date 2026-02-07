// Core Modules
const path = require("path");

// External Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Env
require("dotenv").config();

// Routes
const chatbotRoutes = require("./routes/chatbotRoutes");
const carRouter = require("./routes/carInfoRouter");
const driverRouter = require("./routes/driverInfoRouter");
const authRouter = require("./routes/authRouter");
const carRequestRouter = require("./routes/carRequestRouter");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* 🔥 ADD THIS */
app.set("trust proxy", 1);

// 🔥 REQUIRED FOR RENDER
const PORT = process.env.PORT || 10000;
const DB_URL = process.env.MONGO_URI;

// --------------------
// ✅ MIDDLEWARE
// --------------------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ CORS (VERY IMPORTANT – FIXED)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rentconnect-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// --------------------
// ✅ SESSION STORE
// --------------------
const store = new MongoDBStore({
  uri: DB_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --------------------
// ✅ STATIC FILES
// --------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploadsDrivers",
  express.static(path.join(__dirname, "uploadsDrivers"))
);

// --------------------
// ✅ ROUTES
// --------------------
app.use("/api/carInfo", carRouter);
app.use("/api/driver", driverRouter);
app.use("/api/auth", authRouter);
app.use("/api/carRequest", carRequestRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// ✅ CHATBOT ROUTE (IMPORTANT)
app.use("/api", chatbotRoutes);

// --------------------
// ✅ DB + SERVER
// --------------------
mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
