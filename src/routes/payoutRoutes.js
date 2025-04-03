const express = require('express');
const { createPayout, getPayoutsByCustomerId, processBulkPayouts, bulkCreatePayouts } = require('../controllers/payoutController');

const router = express.Router();

router.post('/', createPayout);
router.get('/customer/:customerId', getPayoutsByCustomerId);
router.post('/process-all', processBulkPayouts);
router.post('/bulk-create', bulkCreatePayouts); // Bulk payout request

module.exports = router;