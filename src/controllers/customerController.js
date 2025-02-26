const Customer = require('../models/Customer');
const { successResponse, errorResponse } = require('../utils/responseHelper');

exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        return successResponse(res, customer, "Customer created successfully", 201);
    } catch (error) {
        return errorResponse(res, error, "Failed to create customer");
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        return successResponse(res, customers, "Customers retrieved successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch customers", 500);
    }
};

exports.getCustomerByPhone = async (req, res) => {
    try {
        const customer = await Customer.findOne({ phone: req.params.phone });
        if (!customer) return errorResponse(res, "Customer not found", "No customer found with this phone number", 404);
        return successResponse(res, customer, "Customer retrieved successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch customer by phone", 500);
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return errorResponse(res, "Customer not found", "No customer found with this ID", 404);
        return successResponse(res, customer, "Customer retrieved successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch customer by ID", 500);
    }
};
