const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req,res,next) => {
  try {
    const {token} = req.cookies
    if(!token) {
      return res.status(401).json({message: "Please login!"})
    }
    // validate the token (secret key) and decode and return the payload (the data (_id) you originally stored in the token)
    const decodedMessage = await jwt.verify(token,process.env.JWT_SECRET)
    const {_id} = decodedMessage

    const user = await User.findById(_id)
    if(!user){
      throw new Error("User not found")
    }

    req.user = user
    next()
  } catch(err){
    res.status(400).json({message: "ERROR: " + err.message})
  }
}

module.exports = {
  userAuth
}