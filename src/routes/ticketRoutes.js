const express = require('express');
const { createTicket, addMessage, getCustomerTickets, getTicketById, updateTicketStatus } = require('../controllers/ticketController');

const router = express.Router();

router.post('/', createTicket); // Create a new ticket
router.post('/:ticketId/message', addMessage); // Add message to ticket
router.get('/customer/:customerId', getCustomerTickets); // Get all tickets for a customer
router.get('/:ticketId', getTicketById); // Get a single ticket by ID
router.patch('/:ticketId/status', updateTicketStatus); // Update ticket status

module.exports = router;
