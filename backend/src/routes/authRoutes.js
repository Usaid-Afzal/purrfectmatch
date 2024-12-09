// src/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation Middleware
const registerValidation = [
  body('username').isLength({ min: 3 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

// Public Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);

// Protected Routes
router.put(
  '/complete-profile', 
  authMiddleware, 
  authController.completeProfile
);

module.exports = router;