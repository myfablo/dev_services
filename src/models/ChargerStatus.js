const mongoose = require('mongoose');

const ChargerStatusSchema = new mongoose.Schema({
    chargerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charger', required: true, unique: true },
    chargingStatus: { type: String, enum: ["idle", "charging", "maintenance"], required: true },
    energyDelivered: { type: Number, required: true }, // kWh
    chargingSessions: { type: Number, required: true }, // Count of sessions
    uptimePercentage: { type: Number, required: true }, // %
    lastMaintenance: { type: Date, required: true },
    temperature: { type: Number, required: true }, // °C
    voltage: { type: Number, required: true }, // V
    adjustedSurplus: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChargerStatus', ChargerStatusSchema);
