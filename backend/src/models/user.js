const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  firstName: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 3,
    },
    lastName: {
      type: String,
      maxlength: 50,
      minlength: 3,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid Email Address:" + value)
        }
      }
    },
    password: {
    type: String,
    required: true,
     validate(value) {
      if(!validator.isStrongPassword(value)){
        throw new Error("Password must be strong (min 8 chars, uppercase, lowercase, number, special char)")
      }
    }
  },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
})

// Create login token:
// Creates a JWT token for the user
// Token contains: User _id
// Token expires in 1 day
// This token proves the user is logged in.
userSchema.methods.getJWT = async function(){
  const user= this
  const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET,{
    expiresIn: "1d"
  });
  return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this
  const passwordHash = user.password
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser, passwordHash
  )
  return isPasswordValid
}

const User = mongoose.model("User", userSchema)
module.exports = User