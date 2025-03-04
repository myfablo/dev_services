const FAQ = require('../models/FAQ');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Add a New FAQ
exports.addFAQ = async (req, res, next) => {
    try {
        const { question, answer, category } = req.body;

        if (!question || !answer || !category) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        const existingFAQ = await FAQ.findOne({ question });
        if (existingFAQ) {
            return errorResponse(res, "FAQ already exists", "Duplicate question", 400);
        }

        const faq = new FAQ({ question, answer, category });
        await faq.save();

        return successResponse(res, faq, "FAQ added successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get All FAQs
exports.getAllFAQs = async (req, res, next) => {
    try {
        const faqs = await FAQ.find();

        if (!faqs.length) {
            return errorResponse(res, "No FAQs found", "No FAQ data available", 404);
        }

        return successResponse(res, faqs, "FAQs retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Get FAQs by Category
exports.getFAQsByCategory = async (req, res, next) => {
    try {
        const faqs = await FAQ.find({ category: req.params.category });

        if (!faqs.length) {
            return errorResponse(res, "No FAQs found", "No FAQs in this category", 404);
        }

        return successResponse(res, faqs, `FAQs retrieved successfully for category: ${req.params.category}`);
    } catch (error) {
        next(error);
    }
};

// 📌 Update an FAQ
exports.updateFAQ = async (req, res, next) => {
    try {
        const { question, answer, category } = req.body;

        const faq = await FAQ.findById(req.params.faqId);
        if (!faq) {
            return errorResponse(res, "FAQ not found", "Invalid FAQ ID", 404);
        }

        if (question) faq.question = question;
        if (answer) faq.answer = answer;
        if (category) faq.category = category;
        faq.updatedAt = new Date();

        await faq.save();
        return successResponse(res, faq, "FAQ updated successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Delete an FAQ
exports.deleteFAQ = async (req, res, next) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.faqId);

        if (!faq) {
            return errorResponse(res, "FAQ not found", "Invalid FAQ ID", 404);
        }

        return successResponse(res, null, "FAQ deleted successfully");
    } catch (error) {
        next(error);
    }
};
