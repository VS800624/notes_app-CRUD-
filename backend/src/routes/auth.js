const express = require("express")
const authRouter = express.Router()
const bcrypt = require("bcrypt")
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

authRouter.post("/signup", async(req,res) => {
  try {
    // validate the data
    validateSignUpData(req)

    // Encrypt the password
    // Converts password into unreadable format
    // Protects user even if DB is hacked
    const passwordHash = await bcrypt.hash(password, 10)

    // creating new instance for the note 
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash
    })

    // Save user in DB
    const savedUser = await user.save()

    // Create JWT token
    const token = await savedUser.getJWT()

    // Store token in cookie 
    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 1 day
    // })
    // or
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,  //1 day
    })   
// httpOnly → JS cannot access cookie (secure)
// secure → only HTTPS
// sameSite: none → frontend & backend on different domains
// maxAge → cookie expires in 1 day
    res.json({message: "User added successfully", data: savedUser})
    
  } catch (err){
    res.status(400).json({message: err.message})
  }
})