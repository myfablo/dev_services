const City = require('../models/City');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Add a New City
exports.addCity = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return errorResponse(res, "Missing city name", "City name is required", 400);
        }

        const existingCity = await City.findOne({ name });
        if (existingCity) {
            return errorResponse(res, "City already exists", "Duplicate city name", 400);
        }

        const city = new City({ name });
        await city.save();

        return successResponse(res, city, "City added successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Get All Cities
exports.getAllCities = async (req, res, next) => {
    try {
        const cities = await City.find();
        return successResponse(res, cities, "Cities retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Delete a City (Admin Only)
exports.deleteCity = async (req, res, next) => {
    try {
        const city = await City.findByIdAndDelete(req.params.cityId);

        if (!city) {
            return errorResponse(res, "City not found", "Invalid city ID", 404);
        }

        return successResponse(res, null, "City deleted successfully");
    } catch (error) {
        next(error);
    }
};
