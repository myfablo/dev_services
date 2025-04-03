const KYC = require('../models/KYC');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Submit KYC Request (Auto-Approved)
exports.submitKYC = async (req, res, next) => {
    try {
        const { customerId, aadhaarNumber, panNumber } = req.body;

        if (!customerId || !aadhaarNumber || !panNumber) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        // Check if customer already submitted KYC
        const existingKYC = await KYC.findOne({ customerId });

        if (existingKYC) {
            return errorResponse(res, "KYC already submitted", "Customer already has a KYC record", 400);
        }

        // Auto-approve KYC upon submission
        const kyc = new KYC({ customerId, aadhaarNumber, panNumber });
        await kyc.save();

        return successResponse(res, kyc, "KYC submitted and approved successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get KYC Details by Customer ID
exports.getKYCDetails = async (req, res, next) => {
    try {
        const kyc = await KYC.findOne({ customerId: req.params.customerId });

        if (!kyc) {
            return errorResponse(res, "KYC not found", "No KYC record exists for this customer", 404);
        }

        return successResponse(res, kyc, "KYC details retrieved successfully");
    } catch (error) {
        next(error);
    }
};
