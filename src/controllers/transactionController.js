const Transaction = require('../models/Transaction');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Create Transaction
exports.createTransaction = async (req, res, next) => {
    try {
        const { customerId, narration, amount, type } = req.body;

        if (!customerId || !narration || !amount || !type) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        if (!["credit", "debit"].includes(type)) {
            return errorResponse(res, "Invalid type", "Type must be 'credit' or 'debit'", 400);
        }

        const transaction = new Transaction({ customerId, narration, amount, type });
        await transaction.save();

        return successResponse(res, transaction, "Transaction recorded successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get Transactions by Customer ID
exports.getTransactionsByCustomerId = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ customerId: req.params.customerId }).sort({ timestamp: -1 });

        if (!transactions.length) {
            return errorResponse(res, "No transactions found", "Customer has no transactions", 404);
        }

        return successResponse(res, transactions, "Transactions retrieved successfully");
    } catch (error) {
        next(error);
    }
};
