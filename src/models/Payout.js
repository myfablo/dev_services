const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    reason: { type: String, required: true }, // Payout reason (e.g., "Profit Withdrawal", "Surplus Payout")
    amount: { type: Number, required: true }, // Payout amount
    status: { type: String, enum: ["pending", "processed"], default: "pending" }, // Payout status
    timestamp: { type: Date, default: Date.now } // Date of payout
});

module.exports = mongoose.model('Payout', PayoutSchema);
