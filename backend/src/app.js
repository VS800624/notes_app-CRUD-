require("dotenv").config(); 
const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")

// CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://notes-vs619.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // credentials: true,
  })
);

//  Razorpay webhook — RAW BODY (must be first)
// app.use(
//   "/api/payment/webhook",
//   express.raw({ type: "application/json" })
// );

  // parsing
  app.use(express.json())
app.use(cookieParser())



// Import routers
const notesRouter = require("./routes/notes")
const authRouter = require("./routes/auth");
const paymentRouter = require("./routes/payment");


// Use Routers
app.use("/api", notesRouter)
app.use("/api", authRouter)
app.use("/api", paymentRouter)

connectDB()
  .then(() => {
    console.log("Database connection established")
    app.listen(process.env.PORT,() => {
      console.log("Server is successfully listening on port 3000...")
    })
  })
  .catch((err) => {
    console.error("Database cannot be connected" + err.message)
  })

  // app.use(express.json()) is a middleware that parses incoming JSON request bodies so the backend can access data using req.body.