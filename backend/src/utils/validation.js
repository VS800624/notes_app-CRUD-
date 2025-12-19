const validator = require("validator")

const validateSignUpData = (req) => {
  const {firstName , lastName, emailId, password} = req.body

  if(!firstName || !lastName){
    throw new Error("Please enter the name")
  }
  if(!validator.isEmail(emailId)){
    throw new Error("Email is not valid")
  }
  if(!validator.isStrongPassword(password)){
    throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
  }
}

module.exports = {
  validateSignUpData
}