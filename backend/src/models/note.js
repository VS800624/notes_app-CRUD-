const mongoose  = require("mongoose");


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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamp: true }
);

noteSchema.index({ userId: 1, createdAt: -1 });
// Fetch notes user-wise
// Show latest notes first
// Much faster queries


const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
