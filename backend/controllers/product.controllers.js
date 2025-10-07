import mongoose from "mongoose";
import Product from "../models/product.js";
import redisClient from "../redisClient.js";


export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
    
// 	  try {
//     // 1️⃣ Try to get products from Redis
//     const cachedProducts = await redisClient.get("products");

//     if (cachedProducts) {
//       console.log("✅ Data from Redis Cache");
//       return res.status(200).json({
//         success: true,
//         data: JSON.parse(cachedProducts),
//         fromCache: true,
//       });
//     }

//     // 2️⃣ If not found, fetch from MongoDB
//     const products = await Product.find({});

//     // 3️⃣ Store fetched data in Redis (cache for 1 hour)
//     await redisClient.setEx("products", 3600, JSON.stringify(products));

//     console.log("🆕 Data from MongoDB");
//     res.status(200).json({ success: true, data: products, fromCache: false });
//   } catch (error) {
//     console.log("error in fetching products:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }


};

export const createProduct = async (req, res) => {
	const product = req.body; // user will send this data

	if (!product.name || !product.price || !product.image) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newProduct = new Product(product);

	try {
		await newProduct.save();
		res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		console.error("Error in Create product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const updateProduct = async (req, res) => {
	const { id } = req.params;

	const product = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		console.log("error in deleting product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
