const express = require('express');
const router = express.Router();
const innovatorController = require('../../controller/innovator.controller');

// Create a new innovator
router.post('/add', innovatorController.upload, innovatorController.addInnovator);

// Read all innovators
router.get('/select-innovators', innovatorController.getAllInnovators);

// Read a specific innovator by ID
router.get('/:id', innovatorController.getInnovatorById);

// Update an innovator
router.put('/:id', innovatorController.updateInnovator);

// Delete an innovator
router.delete('/:id', innovatorController.deleteInnovator);

module.exports = router;
