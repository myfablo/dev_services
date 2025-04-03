const express = require('express');
const { addCity, getAllCities, deleteCity } = require('../controllers/cityController');

const router = express.Router();

router.post('/', addCity); // Add new city
router.get('/', getAllCities); // Get all cities
router.delete('/:cityId', deleteCity); // Delete a city (Admin only)

module.exports = router;