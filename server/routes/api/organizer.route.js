const express = require('express');
const router = express.Router();
const organizerController = require('../../controller/organizer.controller');

//Register organizer route
router.post('/registerOrganizer', organizerController.registerOrganizer)

module.exports = router;