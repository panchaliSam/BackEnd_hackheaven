const express = require('express');
const router = express.Router();
const organizerController = require('../../controller/organizer.controller');

//Register organizer route
router.post('/addHackathonEvent', organizerController.addHackathonEvent)

router.post('/updateHackathonEvent', organizerController.updateHackathonEvent)

router.get('/retrieveHackathonEventsByEmail/:email', organizerController.retrieveHackathonEventsByEmail)

router.delete('/deleteHackathonEvent/:hackathon_id', organizerController.deleteHackathonEvent)


module.exports = router;