const Ticket = require('../models/Ticket');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// 📌 Create a New Support Ticket
exports.createTicket = async (req, res, next) => {
    try {
        const { customerId, subject, description } = req.body;

        if (!customerId || !subject || !description) {
            return errorResponse(res, "Missing fields", "All fields are required", 400);
        }

        const ticket = new Ticket({ customerId, subject, description });
        await ticket.save();

        return successResponse(res, ticket, "Support ticket created successfully", 201);
    } catch (error) {
        next(error);
    }
};

// 📌 Add a Message to a Ticket (Customer/Admin Reply)
exports.addMessage = async (req, res, next) => {
    try {
        const { sender, message } = req.body;

        if (!sender || !message) {
            return errorResponse(res, "Missing fields", "Sender and message are required", 400);
        }

        const ticket = await Ticket.findById(req.params.ticketId);
        if (!ticket) {
            return errorResponse(res, "Ticket not found", "Invalid ticket ID", 404);
        }

        ticket.messages.push({ sender, message });
        ticket.updatedAt = new Date();
        await ticket.save();

        return successResponse(res, ticket, "Message added to ticket successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Get All Tickets for a Customer
exports.getCustomerTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ customerId: req.params.customerId });

        if (!tickets.length) {
            return errorResponse(res, "No tickets found", "Customer has no support tickets", 404);
        }

        return successResponse(res, tickets, "Customer tickets retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Get Single Ticket by ID
exports.getTicketById = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            return errorResponse(res, "Ticket not found", "Invalid ticket ID", 404);
        }

        return successResponse(res, ticket, "Ticket retrieved successfully");
    } catch (error) {
        next(error);
    }
};

// 📌 Update Ticket Status
exports.updateTicketStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["open", "in-progress", "resolved"].includes(status)) {
            return errorResponse(res, "Invalid status", "Allowed statuses: open, in-progress, resolved", 400);
        }

        const ticket = await Ticket.findById(req.params.ticketId);
        if (!ticket) {
            return errorResponse(res, "Ticket not found", "Invalid ticket ID", 404);
        }

        ticket.status = status;
        ticket.updatedAt = new Date();
        await ticket.save();

        return successResponse(res, ticket, "Ticket status updated successfully");
    } catch (error) {
        next(error);
    }
};
