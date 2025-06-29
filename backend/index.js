import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// App setup
const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Updated CORS to include frontend port 5175
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"  // <-- your frontend likely runs here
  ],
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  connectDb(); // connect to MongoDB
});
