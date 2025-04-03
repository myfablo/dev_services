const Payout = require('../models/Payout');
const Bank = require('../models/Bank');
const Charger = require('../models/Charger');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Create Payout Manually
exports.createPayout = async (req, res, next) => {
    try {
        const { customerId, reason, amount } = req.body;

        if (!customerId || !reason || !amount) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        const payout = new Payout({ customerId, reason, amount });
        await payout.save();

        return successResponse(res, payout, "Payout created successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get Payouts by Customer ID
exports.getPayoutsByCustomerId = async (req, res, next) => {
    try {
        const payouts = await Payout.find({ customerId: req.params.customerId }).sort({ timestamp: -1 });

        if (!payouts.length) {
            return errorResponse(res, "No payouts found", "Customer has no payouts", 404);
        }

        return successResponse(res, payouts, "Payouts retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Process Automated Payout for All Customers on Payout Day (10th & 24th)
exports.processPayoutForAll = async (req, res, next) => {
    try {
        const today = new Date();
        const isPayoutDay = today.getDate() === 10 || today.getDate() === 24;

        if (!isPayoutDay) {
            return errorResponse(res, "Not a payout day", "Payouts can only be processed on the 10th and 24th", 400);
        }

        // Get all chargers
        const chargers = await Charger.find();
        if (!chargers.length) {
            return errorResponse(res, "No chargers found", "No machines available", 404);
        }

        // Process payouts for each customer
        for (let charger of chargers) {
            const amount = charger.currentSurplus;
            if (amount > 0) {
                // Create payout
                await new Payout({
                    customerId: charger.customerId,
                    reason: "Surplus Payout",
                    amount: amount,
                    status: "processed"
                }).save();

                // Reset currentSurplus after payout
                charger.totalSurplus += amount;
                charger.currentSurplus = 0;
                await charger.save();
            }
        }

        return successResponse(res, null, "Payouts processed successfully for all customers.");
    } catch (error) {
        next(error);
    }
};


// 📌 Bulk Create Payout Requests for All Eligible Customers (Handling Multiple Chargers)
exports.bulkCreatePayouts = async (req, res, next) => {
    try {
        // Find all chargers where currentSurplus > 0
        const chargers = await Charger.find({ currentSurplus: { $gt: 0 } });

        if (!chargers.length) {
            return errorResponse(res, "No eligible payouts", "No customers have surplus for payout", 404);
        }

        let customerPayouts = {};

        // Aggregate surplus per customer
        for (let charger of chargers) {
            if (!customerPayouts[charger.customerId]) {
                customerPayouts[charger.customerId] = 0;
            }
            customerPayouts[charger.customerId] += charger.currentSurplus;
        }

        let payouts = [];

        // Create payout requests for each customer
        for (let [customerId, totalSurplus] of Object.entries(customerPayouts)) {
            const payout = new Payout({
                customerId,
                reason: "Surplus Payout",
                amount: totalSurplus,
                status: "pending"
            });

            payouts.push(payout);
        }

        // Save all payouts in bulk
        await Payout.insertMany(payouts);

        return successResponse(res, payouts, "Payout requests created successfully for all eligible customers.");
    } catch (error) {
        next(error);
    }
};
