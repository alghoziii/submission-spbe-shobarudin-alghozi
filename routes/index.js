const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');
const cartController = require('../controllers/cartController');
const checkoutController = require('../controllers/checkoutController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Book routes
router.get('/books', authenticate, bookController.getAllBooks);
router.get('/books/:id', authenticate, bookController.getBookDetail);

// Cart routes
router.get('/cart', authenticate, cartController.getCart);
router.post('/cart/items', authenticate, cartController.addToCart);

// Checkout routes
router.post('/checkout', authenticate, checkoutController.checkout);
router.get('/invoices', authenticate, checkoutController.getInvoices);

module.exports = router;