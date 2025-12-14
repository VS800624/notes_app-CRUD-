const express = require("express")
const router = express.Router()
const Note = require("../models/note")

// Create Note
router.post("/create", async(req,res) => {
  try {
    const {title, description} = req.body

    // Check if note already  exists
    const existingNote = await Note.findOne({
      $or: [{title}, {description}]
    })

    if(existing){
      return res.status(400).json({message: "Note with same title or description already exists",})
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
    })
    const data = await note.save()
    res.json({message: "Note created successfully", data})
  } catch (err){
    res.status(500).json({message: "Error creating notes"})
  }
})

module.exports = router