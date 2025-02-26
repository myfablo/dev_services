const express = require('express');
const { createPayout, getPayoutsByCustomerId, processPayoutForAll } = require('../controllers/payoutController');

const router = express.Router();

router.post('/', createPayout);
router.get('/customer/:customerId', getPayoutsByCustomerId);
router.post('/process-all', processPayoutForAll); // Process payouts for all customers

module.exports = router;