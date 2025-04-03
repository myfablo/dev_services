const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    machineName: { type: String, required: true },
    machineUnit: { type: String, required: true },
    description: { type: String },
    gunType: { type: String },
    inputVoltage: { type: String },
    inputFeq: { type: String },
    connectivityMode: { type: String },
    connectivityProtocol: { type: String },
    cableLength: { type: String },
    usageMode: { type: String },
    interface: { type: String },
    compatibility: { type: String },
    dimensions: { type: String },
    machineImage: { type: String }, // Image URL
    price: { type: Number, required: true },
    type: { type: String, enum: ["open", "closed"], default: "open" },
    surplusAmount: { type: Number, required: true }, // Monthly surplus
    timestamps: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
