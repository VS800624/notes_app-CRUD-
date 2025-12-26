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
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // credentials: true,
  })
);



// parsing
app.use(express.json())
app.use(cookieParser())



// Import routers
const notesRouter = require("./routes/notes")
const authRouter = require("./routes/auth")

// Use Routers
app.use("/api", notesRouter)
app.use("/api", authRouter)

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