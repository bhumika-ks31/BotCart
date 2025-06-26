import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

// ------------------ ADD PRODUCT ------------------
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Ensure all 4 images are uploaded
    if (
      !req.files?.image1 || !req.files?.image2 ||
      !req.files?.image3 || !req.files?.image4
    ) {
      return res.status(400).json({ message: "All 4 images are required." });
    }

    // Upload to Cloudinary
    const image1 = await uploadOnCloudinary(req.files.image1[0].path);
    const image2 = await uploadOnCloudinary(req.files.image2[0].path);
    const image3 = await uploadOnCloudinary(req.files.image3[0].path);
    const image4 = await uploadOnCloudinary(req.files.image4[0].path);

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productData);
    return res.status(201).json(product);
  } catch (error) {
    console.error("AddProduct error ➜", error);
    return res.status(500).json({ message: `AddProduct error: ${error.message}` });
  }
};

// ------------------ LIST PRODUCTS ------------------
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error("ListProduct error ➜", error);
    return res.status(500).json({ message: `ListProduct error: ${error.message}` });
  }
};

// ------------------ REMOVE PRODUCT ------------------
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const removedProduct = await Product.findByIdAndDelete(id);
    if (!removedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(removedProduct);
  } catch (error) {
    console.error("RemoveProduct error ➜", error);
    return res.status(500).json({ message: `RemoveProduct error: ${error.message}` });
  }
};
