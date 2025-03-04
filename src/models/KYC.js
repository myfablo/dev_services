const mongoose = require('mongoose');

const KYCSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    aadhaarNumber: { type: String, required: true, unique: true },
    panNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ["approved"], default: "approved" }, // Auto-approved
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KYC', KYCSchema);
