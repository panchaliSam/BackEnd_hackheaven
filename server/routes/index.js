const router = require('express').Router();
const OrganizerRoutes = require('./api/organizer.route');

// Define the root route in your routes file
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to HackHeaven!',
        status: 200
    });
});

//User organizer routes
router.use('/api/organizer', OrganizerRoutes);

// Catch-all route for undefined routes
router.use('*', (req, res) => {
    res.status(404).json('No API route found');
});

module.exports = router;