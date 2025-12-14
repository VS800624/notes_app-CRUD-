const { default: mongoose } = require("mongoose");

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
  },
  { timestamp: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
