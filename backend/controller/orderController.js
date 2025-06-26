import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const currency = 'INR';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 COD Order
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(201).json({ message: 'Order Placed (COD)' });
  } catch (error) {
    console.error("placeOrder error", error);
    res.status(500).json({ message: 'Order Place error' });
  }
};

// 🟢 Razorpay Order Create
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: 'Razorpay',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency: currency,
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay order creation error", error);
        return res.status(500).json({ message: "Failed to create Razorpay order" });
      }

      res.status(200).json({ order, orderId: newOrder._id });
    });
  } catch (error) {
    console.error("placeOrderRazorpay error", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Razorpay Payment Verification
export const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Order.findOneAndUpdate(
        { _id: razorpay_order_id },
        { payment: true }
      );

      await User.findByIdAndUpdate(userId, { cartData: {} });

      return res.status(200).json({ message: '✅ Payment Verified Successfully' });
    } else {
      return res.status(400).json({ message: '❌ Payment Verification Failed' });
    }
  } catch (error) {
    console.error("verifyRazorpay error", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get Orders for a User
export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("userOrders error", error);
    return res.status(500).json({ message: "userOrders error" });
  }
};

// 🟢 Admin: All Orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.error("adminAllOrders error", error);
    return res.status(500).json({ message: "adminAllOrders error" });
  }
};

// 🟢 Admin: Update Order Status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });
    return res.status(201).json({ message: 'Status Updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
