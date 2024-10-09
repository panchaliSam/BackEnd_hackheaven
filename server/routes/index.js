const router = require('express').Router();
const UserRoutes = require('./api/user.route');
const SponsorRoutes = require('./api/sponsor.route');
const InnovatorRoutes = require('./api/innovator.route')

// Define the root route in your routes file
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to HackHeaven!',
        status: 200
    });
});

router.use('/api/user', UserRoutes);
router.use('/api/sponsor', SponsorRoutes)
router.use('/api/innovator', InnovatorRoutes)

// Catch-all route for undefined routes
router.use('*', (req, res) => {
    res.status(404).json('No API route found');
});

module.exports = router;
