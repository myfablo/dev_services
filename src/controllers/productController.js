const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Create Product
exports.createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        return successResponse(res, product, "Product created successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get All Products
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ type: "open" });
        return successResponse(res, products, "Products retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Get Product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return errorResponse(res, "Product not found", "Invalid Product ID", 404);
        return successResponse(res, product, "Product retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Delete Product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return errorResponse(res, "Product not found", "Invalid Product ID", 404);
        return successResponse(res, null, "Product deleted successfully");
    } catch (error) {
        next(error);
    }
};
