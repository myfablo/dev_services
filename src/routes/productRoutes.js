const express = require('express');
const { createProduct, getAllProducts, getProductById, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.delete('/:id', deleteProduct);

module.exports = router;
