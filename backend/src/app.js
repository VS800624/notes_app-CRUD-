require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://notes-vs.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Cookie parser
app.use(cookieParser());

// Skip JSON parsing for Razorpay webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Import routers
const notesRouter = require("./routes/notes");
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payment");

// Use routers
app.use("/api", notesRouter);
app.use("/api", authRouter);
app.use("/api", paymentRouter);

// DB connection
connectDB()
  .then(() => {
    console.log("Database connection established");

    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected " + err.message);
  });

  // app.use(express.json()) is a middleware that parses incoming JSON request bodies so the backend can access data using req.body.