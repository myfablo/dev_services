const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
    messages: [
        {
            sender: { type: String, enum: ["customer", "admin"], required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);
