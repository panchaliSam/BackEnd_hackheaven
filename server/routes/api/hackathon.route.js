const express = require('express');
const router = express.Router();
const hackathonController = require('../../controller/hackathon.controller');

// Create a new hackathon
router.post('/add', hackathonController.addHackathon);

// Read all hackathons
router.get('/select-hackathons', hackathonController.getAllHackathons);

// Read a specific hackathon by ID
router.get('/:id', hackathonController.getHackathonById);

// Update a hackathon
router.put('/:id', hackathonController.updateHackathon);

// Delete a hackathon
router.delete('/:id', hackathonController.deleteHackathon);

// Search hackathons by type
router.get('/search/type', hackathonController.searchHackathonsByType);

// Search hackathons by name
router.get('/search/name', hackathonController.searchHackathonsByName);

//All types
router.get('/search/allTypes', hackathonController.getAllHackathonTypes);


module.exports = router;
