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

const getNextPayoutDate = () => {
    const today = new Date();
    const day = today.getDate();

    if (day <= 10) return new Date(today.getFullYear(), today.getMonth(), 10); // Next 10th
    if (day <= 24) return new Date(today.getFullYear(), today.getMonth(), 24); // Next 24th
    
    // If past 24th, set to next month's 10th
    return new Date(today.getFullYear(), today.getMonth() + 1, 10);
};

const getDaysUntilNextPayout = (fromDate) => {
    const nextPayoutDate = getNextPayoutDate();
    return Math.ceil((nextPayoutDate - fromDate) / (1000 * 60 * 60 * 24));
};

// 📌 Process Bulk Payouts and Update Surplus
exports.processBulkPayouts = async (req, res, next) => {
    try {
        // Fetch all pending payouts
        const pendingPayouts = await Payout.find({ status: "pending" });

        if (!pendingPayouts.length) {
            return errorResponse(res, "No pending payouts", "No transactions to process", 404);
        }

        let processedPayouts = [];
        let failedPayouts = [];

        for (let payout of pendingPayouts) {
            // Fetch customer bank details
            const bankDetails = await Bank.findOne({ customerId: payout.customerId });

            if (!bankDetails) {
                failedPayouts.push({ payoutId: payout._id, reason: "Missing bank details" });
                continue;
            }

            // Simulate payout processing (Replace with real payment API)
            const isSuccess = Math.random() > 0.1; // 90% success rate simulation

            if (isSuccess) {
                // Mark as processed
                payout.status = "processed";
                payout.updatedAt = new Date();
                await payout.save();
                processedPayouts.push({
                    payoutId: payout._id,
                    customerId: payout.customerId,
                    amount: payout.amount,
                    status: "processed",
                    bankDetails: {
                        name: bankDetails.nameOnAccount,
                        bankName: bankDetails.bankName,
                        accountNumber: bankDetails.accountNumber,
                        ifscCode: bankDetails.ifscCode
                    }
                });

                // 📌 Update Charger Surplus for the Next Payout Cycle
                const chargers = await Charger.find({ customerId: payout.customerId }).populate("productId");

                for (let charger of chargers) {
                    if (!charger.productId) continue;

                    // Calculate daily surplus
                    const dailySurplus = (charger.productId.surplusAmount / 12) / 30;
                    const daysUntilNextPayout = getDaysUntilNextPayout(new Date());

                    // Update charger surplus to reflect next cycle
                    charger.totalSurplus += charger.currentSurplus; // Add old surplus to total
                    charger.currentSurplus = (dailySurplus * daysUntilNextPayout).toFixed(2);
                    await charger.save();
                }
            } else {
                failedPayouts.push({ payoutId: payout._id, reason: "Payment gateway error" });
            }
        }

        return successResponse(res, { processedPayouts, failedPayouts }, "Bulk payouts processed successfully, surplus updated.");
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
