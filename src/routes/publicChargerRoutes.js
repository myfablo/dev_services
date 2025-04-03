const express = require('express');
const { addPublicCharger, getChargersByCity } = require('../controllers/publicChargerController');

const router = express.Router();

router.post('/', addPublicCharger); // Add new public charger
router.get('/city/:cityId', getChargersByCity); // Get chargers by city ID

module.exports = router;