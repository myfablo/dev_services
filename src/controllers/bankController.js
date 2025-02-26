const Bank = require('../models/Bank');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Add or Update Bank Details
exports.addOrUpdateBankDetails = async (req, res, next) => {
    try {
        const { customerId, nameOnAccount, bankName, accountNumber, ifscCode, bankBranch } = req.body;

        if (!customerId || !nameOnAccount || !bankName || !accountNumber || !ifscCode || !bankBranch) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        const existingBank = await Bank.findOne({ customerId });

        if (existingBank) {
            // Update existing bank details
            existingBank.nameOnAccount = nameOnAccount;
            existingBank.bankName = bankName;
            existingBank.accountNumber = accountNumber;
            existingBank.ifscCode = ifscCode;
            existingBank.bankBranch = bankBranch;
            await existingBank.save();

            return successResponse(res, existingBank, "Bank details updated successfully");
        }

        // Create new bank details
        const bank = new Bank({ customerId, nameOnAccount, bankName, accountNumber, ifscCode, bankBranch });
        await bank.save();

        return successResponse(res, bank, "Bank details added successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get Bank Details by Customer ID
exports.getBankDetailsByCustomerId = async (req, res, next) => {
    try {
        const bankDetails = await Bank.findOne({ customerId: req.params.customerId });

        if (!bankDetails) {
            return errorResponse(res, "Bank details not found", "No bank details available for this customer", 404);
        }

        return successResponse(res, bankDetails, "Bank details retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Delete Bank Details
exports.deleteBankDetails = async (req, res, next) => {
    try {
        const bank = await Bank.findOneAndDelete({ customerId: req.params.customerId });

        if (!bank) {
            return errorResponse(res, "Bank details not found", "No bank details available for this customer", 404);
        }

        return successResponse(res, null, "Bank details deleted successfully");
    } catch (error) {
        next(error);
    }
};
