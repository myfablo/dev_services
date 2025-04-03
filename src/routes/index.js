const express = require('express');
const router = express.Router();
const customerRoutes = require('./customerRoutes');
const chargerRoutes = require('./chargerRoutes');
const transactionRoutes = require('./transactionRoutes');
const productRoutes = require('./productRoutes');
const payoutRoutes = require('./payoutRoutes');
const bankRoutes = require('./bankRoutes');
const kycRoutes = require('./kycRoutes');
const ticketRoutes = require('./ticketRoutes');
const faqRoutes = require('./faqRoutes');
const cityRoutes = require('./cityRoutes');
const publicChargerRoutes = require('./publicChargerRoutes');

router.use('/customers', customerRoutes);
router.use('/chargers', chargerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/products', productRoutes);
router.use('/payouts', payoutRoutes);
router.use('/banks', bankRoutes);
router.use('/kyc', kycRoutes);
router.use('/tickets', ticketRoutes);
router.use('/faqs', faqRoutes);
router.use('/cities', cityRoutes);
router.use('/public-chargers', publicChargerRoutes);

module.exports = router;
