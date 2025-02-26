const mongoose = require('mongoose');

const ChargerSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    totalSurplus: { type: Number, default: 0 }, // Always 0 initially
    currentSurplus: { type: Number, required: true }, // Calculated dynamically
    installationCity: { type: String, required: true },
    installationArea: { type: String, required: true },
    portfolioDate: { type: Date, required: true }, // New field for portfolio date
    timestamps: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Charger', ChargerSchema);
