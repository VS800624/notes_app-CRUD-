const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// compound unique index
noteSchema.index({ title: 1, description: 1, userId: 1 }, { unique: true });
// This ensures that the combination of these three fields must be unique.

noteSchema.index({ userId: 1, createdAt: -1 });
// Fetch notes user-wise
// Show latest notes first
// Much faster queries

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;

// What ref: "User" actually means
// It tells Mongoose:
// “This ObjectId belongs to a document from the User collection.”
