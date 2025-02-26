const express = require('express');
const { addOrUpdateBankDetails, getBankDetailsByCustomerId, deleteBankDetails } = require('../controllers/bankController');

const router = express.Router();

router.post('/', addOrUpdateBankDetails);
router.get('/customer/:customerId', getBankDetailsByCustomerId);
router.delete('/customer/:customerId', deleteBankDetails);

module.exports = router;
