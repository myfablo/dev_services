const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    narration: { type: String, required: true }, // Description of the transaction
    amount: { type: Number, required: true }, // Transaction amount
    type: { type: String, enum: ["credit", "debit"], required: true }, // Transaction type
    timestamp: { type: Date, default: Date.now } // Date of transaction
});

module.exports = mongoose.model('Transaction', TransactionSchema);
