const Charger = require('../models/Charger');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const ChargerStatus = require('../models/ChargerStatus');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Create Charger
exports.createCharger = async (req, res, next) => {
    try {
        const { customerId, productId, installationCity, installationArea, portfolioDate } = req.body;

        if (!portfolioDate) {
            return errorResponse(res, "Portfolio date is required", "Missing portfolioDate", 400);
        }

        const portfolioTimestamp = new Date(portfolioDate);
        if (isNaN(portfolioTimestamp.getTime())) {
            return errorResponse(res, "Invalid date format", "portfolioDate must be a valid timestamp", 400);
        }

        // Fetch product details
        const product = await Product.findById(productId);
        if (!product) return errorResponse(res, "Invalid Product ID", "Product not found", 404);

        // Correct Daily Surplus Calculation (Rounded to 2 Decimal Places)
        const dailySurplus = ((product.surplusAmount / 12) / 30).toFixed(2);

        // Calculate Days Until Next Payout (10th or 24th of the next month)
        const today = new Date();
        const currentDay = today.getDate();
        let nextPayoutDate;

        if (currentDay < 10) {
            nextPayoutDate = 10;
        } else if (currentDay < 24) {
            nextPayoutDate = 24;
        } else {
            // Next month's 10th
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10);
            nextPayoutDate = nextMonth.getDate();
        }

        let daysUntilNextPayout;
        if (currentDay < nextPayoutDate) {
            daysUntilNextPayout = nextPayoutDate - currentDay;
        } else {
            // Calculate days left until 10th of next month
            const nextMonthPayout = new Date(today.getFullYear(), today.getMonth() + 1, 10);
            const timeDiff = nextMonthPayout - today;
            daysUntilNextPayout = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        }

        // Calculate Current Surplus and Ensure 2 Decimal Precision
        const currentSurplus = (dailySurplus * daysUntilNextPayout).toFixed(2);

        // Create new Charger
        const charger = new Charger({
            customerId,
            productId,
            totalSurplus: 0,
            currentSurplus: parseFloat(currentSurplus), // Ensure value is stored as a number
            installationCity,
            installationArea,
            portfolioDate: portfolioTimestamp
        });

        await charger.save();

        // 📌 Create a Transaction for the Charger Purchase
        const transaction = new Transaction({
            customerId,
            narration: `Charger Purchased`,
            amount: product.price,
            type: "credit"
        });

        await transaction.save();

        return successResponse(res, { charger, transaction }, "Charger created successfully and transaction recorded", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get All Chargers
exports.getAllChargers = async (req, res, next) => {
    try {
        const chargers = await Charger.find().populate("customerId productId");

        // Fetch charger status from ChargerStatus collection
        const chargerIds = chargers.map((c) => c._id);
        const chargerStatuses = await ChargerStatus.find({ chargerId: { $in: chargerIds } });

        const enhancedChargers = chargers.map((charger) => {
            const status = chargerStatuses.find((s) => s.chargerId.toString() === charger._id.toString());
            return {
                ...charger.toObject(),
                ...(status ? status.toObject() : { message: "Status not available" })
            };
        });

        return successResponse(res, enhancedChargers, "Chargers retrieved successfully with status");
    } catch (error) {
        next(error);
    }
};

// 📌 Get Chargers by Customer ID
exports.getChargersByCustomerId = async (req, res, next) => {
    try {
        const chargers = await Charger.find({ customerId: req.params.customerId }).populate("productId");

        if (!chargers.length) return errorResponse(res, "No chargers found", "Customer has no chargers", 404);

        const chargerIds = chargers.map((c) => c._id);
        const chargerStatuses = await ChargerStatus.find({ chargerId: { $in: chargerIds } });

        const enhancedChargers = chargers.map((charger) => {
            const status = chargerStatuses.find((s) => s.chargerId.toString() === charger._id.toString());
            return {
                ...charger.toObject(),
                ...(status ? status.toObject() : { message: "Status not available" })
            };
        });

        return successResponse(res, enhancedChargers, "Chargers retrieved successfully with status");
    } catch (error) {
        next(error);
    }
};


// 📌 Payout Day API - Update Surplus for All Machines
exports.updateSurplusOnPayoutDay = async (req, res, next) => {
    try {
        // Get all chargers in the system
        const chargers = await Charger.find();

        if (!chargers.length) return errorResponse(res, "No chargers found", "No machines available", 404);

        const today = new Date();
        const nextPayoutDate = today.getDate() <= 10 ? 24 : 10;
        const daysUntilNextPayout = nextPayoutDate - today.getDate();

        // Update totalSurplus & recalculate currentSurplus
        for (let charger of chargers) {
            const product = await Product.findById(charger.productId);
            if (!product) continue;

            // Calculate new surplus
            const dailySurplus = product.surplusAmount / 30;
            const newCurrentSurplus = dailySurplus * daysUntilNextPayout;

            // Update charger
            charger.totalSurplus += charger.currentSurplus;
            charger.currentSurplus = newCurrentSurplus;

            await charger.save();
        }

        return successResponse(res, null, "Surplus updated successfully for all chargers on payout day.");
    } catch (error) {
        next(error);
    }
};