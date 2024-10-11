const { admin } = require('../config/firebase'); // Ensure you import the admin instance

// Function to fetch all users
exports.fetchAllUsers = async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(); // Use admin.auth() here
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
        }));
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
};
