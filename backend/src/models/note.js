const { default: mongoose } = require("mongoose");
const validator = require('validator')


const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
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
    minlength: 6,
     validate(value) {
      if(!validator.isStrongPassword(value)){
        throw new Error("Password must be strong (min 8 chars, uppercase, lowercase, number, special char)")
      }
    }
  },
  },
  { timestamp: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
