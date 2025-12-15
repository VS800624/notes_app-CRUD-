require("dotenv").config(); 
const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cors = require("cors")

// CORS Setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// CORS Pre-flight
// app.options("*", cors());

// parsing
app.use(express.json())



// Import routers
const notesRouter = require("./routes/notes")

// Use Routers
app.use("/api", notesRouter)

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