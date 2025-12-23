const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // console.log(req.body);


    // Encrypt the password
    // Converts password into unreadable format
    // Protects user even if DB is hacked
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // Save user in DB
    const savedUser = await user.save();

    // Create JWT token
    const token = await savedUser.getJWT();

    // Store token in cookie
    // res.cookie("token", token, {
    //   expires: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 1 day
    // })
    // or
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV === "production",
    //   secure: false,
    //   // sameSite: "none",
    //   sameSite: "lax",        // ✅ works on localhost
    //   maxAge: 24 * 60 * 60 * 1000,  //1 day
    // })
    // httpOnly → JS cannot access cookie (secure)
    // secure → only HTTPS
    // sameSite: none → frontend & backend on different domains
    // If sameSite = "none"
    // then secure MUST be true
    // and the request MUST be HTTPS
    // maxAge → cookie expires in 1 day

    const userResponse = savedUser.toObject();
    delete userResponse.password;
    // res.json({message: "User added successfully", data: userResponse})
    res.json({
      message: "User added successfully",
      data: {
        user: userResponse,
        token: token,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
    return res.status(400).json({ message: "Email already exists" });
  }
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // validate email
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // find user by email
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // comparing password or validating it
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "" });
    }

    // Create JWT token
    const token = await user.getJWT();

    // Set cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   // secure: process.env.NODE_ENV === "production",
    //   secure: false,
    //   // sameSite: "none",
    //   sameSite: "lax", // ✅ works on localhost
    //   maxAge: 24 * 60 * 60 * 1000, //1 day
    // });

    res.json({ message: "Logged in successfully!!!", data: { user, token } });
  } catch (err) {
    res.status({ message: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  // Clear cookie
  //   res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  //   httpOnly: true,
  // });
  // or res.cookie("token", "", { maxAge: 0 });

  res.json({ message: "Logout successfully!" });
});

module.exports = authRouter;

// Cookie-based auth across origins requires HTTPS.
// On localhost, token-based auth is simpler and more reliable.
