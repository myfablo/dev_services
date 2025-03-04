const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FAQ', FAQSchema);