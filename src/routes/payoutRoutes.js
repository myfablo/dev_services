const express = require('express');
const { createPayout, getPayoutsByCustomerId, processPayoutForAll, bulkCreatePayouts } = require('../controllers/payoutController');

const router = express.Router();

router.post('/', createPayout);
router.get('/customer/:customerId', getPayoutsByCustomerId);
router.post('/process-all', processPayoutForAll);
router.post('/bulk-create', bulkCreatePayouts); // Bulk payout request

module.exports = router;