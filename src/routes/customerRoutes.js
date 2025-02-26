const express = require('express');
const { createCustomer, getAllCustomers, getCustomerByPhone, getCustomerById } = require('../controllers/customerController');

const router = express.Router();

router.post('/', createCustomer);
router.get('/', getAllCustomers);
router.get('/phone/:phone', getCustomerByPhone);
router.get('/:id', getCustomerById);

module.exports = router;