const express = require('express');
const router = express.Router();
const customerRoutes = require('./customerRoutes');
const chargerRoutes = require('./chargerRoutes');
const transactionRoutes = require('./transactionRoutes');
const productRoutes = require('./productRoutes');
const payoutRoutes = require('./payoutRoutes');
const bankRoutes = require('./bankRoutes');

router.use('/customers', customerRoutes);
router.use('/chargers', chargerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/products', productRoutes);
router.use('/payouts', payoutRoutes);
router.use('/banks', bankRoutes);

module.exports = router;
