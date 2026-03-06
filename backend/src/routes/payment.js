const express = require("express");
const paymentRouter = express.Router();
const razorPayInstance = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");
const Payment = require("../models/payment");
const { userAuth } = require("../middlewares/auth");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    // this is the code to create order on razorPay , we have initialized our razorpay instance with key
    const order = await razorPayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100, //this value is in lower denomination of currency(this is in paisa)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
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

    console.log("Order created from Razorpay:", order);
    console.log("Saved OrderId in DB:", order.id);
    const savedPayment = await payment.save();

    // return back my order details to frontend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay webhook — RAW BODY (must be first)
paymentRouter.post("/payment/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    // paymentRouter.post("/payment/webhook",  async (req, res) => {
    try {
      console.log("Webhook start");
      console.log("Body type:", Buffer.isBuffer(req.body));
      const webhookSignature = req.header("X-Razorpay-Signature");
      // or const webhookSignature = req.get("X-Razorpay-Signature")
      console.log("Signature:", webhookSignature);

      console.log("Full Body:", req.body);

      // It will validate whether my webhook is correct or not
      // Verify signature with RAW body
      const isWebhookValid = validateWebhookSignature(
        // JSON.stringify(req.body),
        req.body,
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET,
      );

      console.log("Is Webhook Valid:", isWebhookValid);

      if (!isWebhookValid) {
        return res
          .status(400)
          .json({ message: "Webhook signature is invalid" });
      }

      //  NOW parse the body
      const body = JSON.parse(req.body.toString());
      // Use parsed body safely
      const event = body.event;
      // const event = req.body.event;
      console.log("Event Type:", event);

      // Update my payment status in DB
      // const paymentDetails = req.body.payload.payment.entity;
      const paymentDetails = body.payload.payment.entity;
      console.log(paymentDetails);

      console.log("Payment Details:", JSON.stringify(paymentDetails, null, 2));
      console.log("Order ID from Razorpay:", paymentDetails.order_id);
      console.log("Payment ID:", paymentDetails.id);

      console.log("Searching payment for orderId:", paymentDetails.order_id);

      console.log("DB Orders:");
      const allPayments = await Payment.find({});
      console.log(allPayments.map((p) => p.orderId));

      const payment = await Payment.findOne({
        orderId: paymentDetails.order_id,
      });

      console.log("Payment found in DB:", payment);

      // if (!payment) {
      //   return res.status(404).json({ message: "Payment not found" });
      // }

      if (!payment || paymentDetails.status !== "captured") {
        console.log("Ignoring webhook - payment not found or not captured");
        return res.status(200).json({ message: "Ignoring webhook" });
      }

      // Handle FAILED payment
      if (event === "payment.failed") {
        payment.status = "failed";
        await payment.save();

        console.log("Payment status updated to FAILED");

        return res.status(200).json({ message: "Payment failed recorded" });
      }

      // Prevent duplicate webhook process
      if (payment.status === "captured") {
        console.log("⚠️ Payment already captured earlier");
        return res.status(200).json({ message: "Already processed" });
      }

      if (event === "payment.captured") {
        // Update payment
        payment.status = "captured";
        await payment.save();

        console.log("Payment status updated to CAPTURED");

        // Upgrade user
        const user = await User.findById(payment.userId);
        console.log("User found:", user);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();
        console.log("🎉 User upgraded to PREMIUM");
      }
      console.log("========== WEBHOOK END ==========");
      // return success response to razorpay
      res.status(200).json({ message: "Webhook received successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

// paymentRouter.post(
//   "/payment/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     try {
//       console.log("========== WEBHOOK START ==========");

//       const webhookSignature = req.header("X-Razorpay-Signature");

//       const rawBody = req.body;

//       console.log("Raw body buffer received");

//       const isWebhookValid = validateWebhookSignature(
//         rawBody,
//         webhookSignature,
//         process.env.RAZORPAY_WEBHOOK_SECRET
//       );

//       if (!isWebhookValid) {
//         console.log("Invalid webhook signature");
//         return res.status(400).json({ message: "Invalid signature" });
//       }

//       const body = JSON.parse(rawBody.toString());

//       const paymentDetails = body.payload.payment.entity;
//       const event = body.event;

//       console.log("Event:", event);
//       console.log("Order ID:", paymentDetails.order_id);

//       // Continue your logic...

//     } catch (err) {
//       console.log("Webhook Error:", err);
//       res.status(500).json({ message: err.message });
//     }
//   }
// );

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  console.log(user);
  if (user.isPremium) {
    return res.json({ isPremium: true });
  }
  return res.json({ isPremium: false });
});

module.exports = paymentRouter;
