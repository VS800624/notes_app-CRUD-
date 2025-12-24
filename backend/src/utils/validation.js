const validator = require("validator")

const validateSignUpData = (req) => {
  const {firstName , lastName, emailId, password} = req.body

 
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  }

  if (typeof emailId !== "string") {
    throw new Error("Email must be a string");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }
  
  if(!validator.isStrongPassword(password)){
    throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
  }
}

module.exports = {
  validateSignUpData
}