const mongoose = require("mongoose")


const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: User,     // attaching this collection to the user collection i.e. each payment should be linked to a user
    required: true
  },
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true
    },
    notes: {
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
    }

}, {timestamps: true})

module.exports = new mongoose.model("payment", paymentSchema)