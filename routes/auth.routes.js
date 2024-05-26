const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerAdmin, loginAdmin } = require('../controllers/auth.controller');

// User Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin Routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

module.exports = router;
