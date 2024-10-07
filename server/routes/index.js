const router = require('express').Router();
const UserRoutes = require('./api/user.route');

// Define the root route in your routes file
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to HackHeaven!',
        status: 200
    });
});

// Use user routes
router.use('/api/user', UserRoutes);

// Catch-all route for undefined routes
router.use('*', (req, res) => {
    res.status(404).json('No API route found');
});

module.exports = router;
