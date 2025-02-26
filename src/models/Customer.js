const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    timestamps: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', CustomerSchema);
