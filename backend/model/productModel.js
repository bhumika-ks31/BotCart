import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image1: {
    type: String,
    required: true
  },
  image2: {
    type: String,
    required: true
  },
  image3: {
    type: String,
    required: true
  },
  image4: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  sizes: {
    type: [String], // Explicitly typed as array of strings
    required: true
  },
  date: {
    type: Date, // Changed to Date for proper timestamps
    default: Date.now
  },
  bestseller: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
