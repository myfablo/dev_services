const express = require('express');
const { createCharger, getAllChargers, getChargersByCustomerId, updateSurplusOnPayoutDay } = require('../controllers/chargerController');

const router = express.Router();

router.post('/', createCharger);
router.get('/', getAllChargers);
router.get('/customer/:customerId', getChargersByCustomerId);
router.post('/update-surplus', updateSurplusOnPayoutDay); // New Payout API

module.exports = router;
