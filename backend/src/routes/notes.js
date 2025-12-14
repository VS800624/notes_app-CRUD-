const express = require("express")
const router = express.Router()
const Note = require("../models/note")

// Create Note
router.post("/notes/create", async(req,res) => {
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
    res.status(500).json({message: "Error creating note"})
  }
})

// Get all Notes
router.get("/notes", async(req,res) => {
  try {
    const notes = await Note.find()
    res.json({message: "Fetched all the notes successfully", data: notes})
  } catch (err){
    res.status(500).json({message: "Error fetching notes"})
  }
})

// Update Notes
router.put("/notes/edit/:id", async(req,res) => {
  try{
    const {title, description,}  = req.body
    // findByIdAndUpdate takes  3 arguments: (id, updateObject, options)
    const updateNote = await Note.findByIdAndUpdate(
      req.params.id,           //id
      {title, description},   //update object
      {new: true}             // return updated document
    )
    res.json({message: "Note updated successfully" ,data:updateNote})
  } catch (err) {
     res.status(500).json({message: "Error updating notes"})
  }
})

module.exports = router


// Mongoose update methods return the old document by default. Setting { new: true } ensures the updated document is returned after the update.
