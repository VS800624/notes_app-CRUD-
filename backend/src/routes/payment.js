const express = require("express");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");
const Payment = require("../models/payment");
const { userAuth } = require("../middlewares/auth");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firtName, lastName, emailId } = req.user;

    // this is the code to create order on razorPay , we have initialized our razorpay instance with key
    const order = await razorPayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, //this value is in lower denomination of currency(this is in paisa)
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        memberShip: membershipType,
      },
    }); //this will return a promise and we will create an order

    // Save it in my database
    const payment = new Payment({
      userId: req.user._id, //the userId will come from userAuth
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    // return back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = paymentRouter;
