// router/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../../controller/user.controller');

// Add User Route
router.post('/add', userController.addUser);

// Update User Route
router.put('/update', userController.updateUser);

module.exports = router;
