const express = require('express');
const { addFAQ, getAllFAQs, getFAQsByCategory, updateFAQ, deleteFAQ } = require('../controllers/faqController');

const router = express.Router();

router.post('/', addFAQ); // Add FAQ
router.get('/', getAllFAQs); // Get all FAQs
router.get('/category/:category', getFAQsByCategory); // Get FAQs by category
router.patch('/:faqId', updateFAQ); // Update an FAQ
router.delete('/:faqId', deleteFAQ); // Delete an FAQ

module.exports = router;