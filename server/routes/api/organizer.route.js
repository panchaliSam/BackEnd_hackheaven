const express = require('express');
const router = express.Router();
const organizerController = require('../../controller/organizer.controller');

//Register organizer route
router.post('/addHackathonEvent', organizerController.addHackathonEvent)

router.put('/updateHackathonEvent', organizerController.updateHackathonEvent)

router.get('/retrieveHackathonEventsByEmail', organizerController.retrieveHackathonEventsByEmail)

router.get('/getEventDetails', organizerController.getEventDetails)

router.delete('/deleteHackathonEvent', organizerController.deleteHackathonEvent)


module.exports = router;