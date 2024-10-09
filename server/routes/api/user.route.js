// router/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../../controller/');

// Add User Route
router.post('/add', userController.addUser);

// Route to get user emails
router.get('/user-emails', userController.selectUserEmails);

module.exports = router;
