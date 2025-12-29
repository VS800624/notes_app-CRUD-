const express = require("express");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");
const Payment = require("../models/payment");
const { userAuth } = require("../middlewares/auth");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    // this is the code to create order on razorPay , we have initialized our razorpay instance with key
    const order = await razorPayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, //this value is in lower denomination of currency(this is in paisa)
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
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

paymentRouter.post("/payment/webhook", async(req,res) => {
  try{
    const webhookSignature = req.header("X-Razorpay-Signature")
    // or const webhookSignature = req.get("X-Razorpay-Signature")

    // It will validate whether my webhook is correct or not 
    const isWebhookValid = validateWebhookSignature(
      // JSON.stringify(req.body),
      req.body,
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    )

    if(!isWebhookValid){
      return res.status(400).json({message:"Webhook signature is invalid"})
    }

    // Update my payment status in DB
    const  paymentDetails = req.body.payload.payment.entity
    
    const payment = await Payment.findOne({orderId: paymentDetails.order_id})

     if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
      }

      const event = req.body.event;

    // Handle FAILED payment
    if (event === "payment.failed") {
      payment.status = "failed";
      await payment.save();

      return res.status(200).json({ message: "Payment failed recorded" });
    }

       // Prevent duplicate webhook process
     if (payment.status === "captured") {
      return res.status(200).json({ message: "Already processed" });
    }
     // Update payment
    payment.status = paymentDetails.status
    await payment.save()

    // Upgrade user
    if (paymentDetails.status === "captured") {
      const user = await User.findById(payment.userId);
      
       if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      await user.save();
    }

    // return success response to razorpay 
    res.status(200).json({message: "Webhook received successfully"})
  } catch(err){
    res.status(500).json({ success: false, message: err.message });
  }
})

paymentRouter.get("/premium/verify", userAuth, async (req,res) => {
  const user =  req.user
  if(user.isPremium){
    return res.json({isPremium: true})
  }
  return res.json({isPremium:false})
})

module.exports = paymentRouter;
