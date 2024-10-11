const express = require('express');
const router = express.Router();
const authUserController = require('../../controller/auth.user.controller');

// Read all hackathons
router.get('/get-users', authUserController.fetchAllUsers);

module.exports = router;
