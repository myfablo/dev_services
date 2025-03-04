const PublicCharger = require('../models/PublicCharger');
const City = require('../models/City');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Add a New Public Charger (Using City ID)
exports.addPublicCharger = async (req, res, next) => {
    try {
        const { name, area, cityId, acDcType, rating, latitude, longitude, unitPrice, timing, status } = req.body;

        if (!name || !area || !cityId || !acDcType || !latitude || !longitude || !unitPrice || !timing || !status) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        const city = await City.findById(cityId);
        if (!city) {
            return errorResponse(res, "Invalid city ID", "City not found", 404);
        }

        const charger = new PublicCharger({ name, area, cityId, type, acDcType, rating, latitude, longitude, unitPrice, timing, status });
        await charger.save();

        return successResponse(res, charger, "Public charger added successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get Chargers by City ID
exports.getChargersByCity = async (req, res, next) => {
    try {
        const chargers = await PublicCharger.find({ cityId: req.params.cityId }).populate('cityId', 'name');

        if (!chargers.length) {
            return errorResponse(res, "No chargers found", "No chargers available in this city", 404);
        }

        return successResponse(res, chargers, `Public chargers retrieved successfully`);
    } catch (error) {
        next(error);
    }
};