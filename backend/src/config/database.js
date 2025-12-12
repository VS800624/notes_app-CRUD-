const mongoose = require("mongoose")

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET)
  // or 
   //  await mongoose.connect(process.env.DB_CONNECTION_SECRET, {
  //     dbName: "notesDB",
  //   });
}

module.exports = connectDB