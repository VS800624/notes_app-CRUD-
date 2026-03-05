const express = require("express");
const router = express.Router();
const Note = require("../models/note");
const { userAuth } = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");

// Create Note
router.post("/notes/create", userAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id; //Extract user from middleware

    // validation
    if (!title || !description) {
      return res.json({ message: "Title and description are required" });
    }

    // check if note already exists for this user
    const existingNote = await Note.findOne({
      userId,
      $or: [{ title }, { description }],
    });

    if (existingNote) {
      return res.status(400).json({
        message: "Note with same title or description already exists",
      });
    }

    // Create and save note

    // Creates instance internally and Saves it immediately, One-liner shortcut
    // const note = await Note.create({
    // title, description
    // })
    // or
    // created a Mongoose document instance and then saving it
    const note = new Note({
      title,
      description,
      userId,
    });
    const data = await note.save();
    res.json({ message: "Note created successfully", data });
  } catch (err) {
    // console.error("ERROR:", err);
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// Get all Notes
router.get("/notes", userAuth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });
    res.json({ message: "Fetched all the notes successfully", data: notes });
  } catch (err) {
    // console.error("ERROR:", err);
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// Get one note
router.get("/note/:id", userAuth, async (req, res) => {
  try {
    const note = await Note.findById({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note fetched successfully", data: note });
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// Edit Notes
router.put("/notes/edit/:id", userAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const { title, description } = req.body;
    // findByIdAndUpdate takes  3 arguments: (id, updateObject, options)
    const updateNote = await Note.findByIdAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      { title, description }, //update object
      { new: true }, // return updated document
    );

    if (!updateNote) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note updated successfully", data: updateNote });
  } catch (err) {
    // console.error("Update ERROR:", err);
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// Delete Notes
router.delete("/notes/delete/:id", userAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const deletedNotes = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedNotes) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Deleted note successfully" });
  } catch (err) {
    // console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// Pin notes
router.put("/pin/:id", userAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user_.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      message: note.isPinned ? "Note pinned" : "Note unpinned",
      note,
    });
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// Archive note
router.put("/archive/:id", userAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Id" });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user_.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.isArchived = !note.isArchived;
    note.save();

    res.json({ message: note.isArchived ? "Note archived" : "Note restored" });
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// fetch pinned notes
router.get("/pin", userAuth, async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user_.id,
      isArchived: false,
    }).sort({ isPinned: -1, createdAt: -1 });


    res.json({ message: "Fetched pinned notes successfully", notes });

  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});

// fetch archived notes
router.get("/archive", userAuth, async(req,res) => {
  try{

    const  notes = await Note.find({
      userId: req.user._id,
      isArchived: true
    }).sort({ createdAt: -1 });

    res.json({message: "Fetched archived notes successfully", notes})
    
  }catch(err){
    res.status(500).json({message: "ERROR: " + err.message})
  }
})

module.exports = router;

// Mongoose update methods return the old document by default. Setting { new: true } ensures the updated document is returned after the update.
