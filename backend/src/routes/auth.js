const express = require("express")
const authRouter = express.Router()
const bcrypt = require("bcrypt")
const Note = require("../models/note");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async(req,res) => {
  try {
    // validate the data
    validateSignUpData(req)

    
  } catch (err){
    res.status(400).json({message: err.message})
  }
})