const express = require('express');
const { submitKYC, getKYCDetails } = require('../controllers/kycController');

const router = express.Router();

router.post('/', submitKYC); // Submit KYC request
router.get('/customer/:customerId', getKYCDetails); // Get KYC details

module.exports = router;
