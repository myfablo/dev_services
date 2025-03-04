const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    nameOnAccount: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    ifscCode: { type: String, required: true },
    timestamps: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bank', BankSchema);
