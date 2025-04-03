const mongoose = require('mongoose');

const PublicChargerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    area: { type: String, required: true },
    cityId: { type: String, required: true },
    acDcType: { type: String, enum: ["AC", "DC"], required: true },
    rating: { type: Number, min: 1, max: 5, default: 0 },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    timing: { type: String, required: true },
    status: { type: String, enum: ["available", "unavailable", "maintenance"], default: "available" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PublicCharger', PublicChargerSchema);