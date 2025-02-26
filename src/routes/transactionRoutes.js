const express = require('express');
const { createTransaction, getTransactionsByCustomerId } = require('../controllers/transactionController');

const router = express.Router();

router.post('/', createTransaction);
router.get('/customer/:customerId', getTransactionsByCustomerId);

module.exports = router;
