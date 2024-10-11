const express = require('express');
const router = express.Router();
const sponsorshipController = require('../../controller/sponsor.controller');

// Create a new sponsor
// router.post('/add', sponsorshipController.addSponsor);
router.post('/add', sponsorshipController.upload, sponsorshipController.addSponsor);

// Read all sponsors
router.get('/select-sponsors', sponsorshipController.getAllSponsors);

// Read a specific sponsor by ID
router.get('/:id', sponsorshipController.getSponsorById);

// Update a sponsor
router.put('/:id', sponsorshipController.updateSponsor);

// Delete a sponsor
router.delete('/:id', sponsorshipController.deleteSponsor);

// Select by category
router.get('/search/category', sponsorshipController.searchSponsorsByCategory);

module.exports = router;
