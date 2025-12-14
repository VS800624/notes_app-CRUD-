require("dotenv").config(); 
const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cors = require("cors")

// parsing
app.use(express.json())


// Import routers
const notesRouter = require("./routes/notes")

// Use Routers
app.use("/", notesRouter)

connectDB()
  .then(() => {
    console.log("Database connection established")
    app.listen(process.env.PORT,() => {
      console.log("Server is successfully listening on port 3000...")
    })
  })
  .catch((err) => {
    console.error("Database cannot be connected")
  })