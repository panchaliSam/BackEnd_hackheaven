const connectDatabase = require('../config/database.config');

// Add User
exports.addUser = async (req, res) => {
    const { email, user_token } = req.body; // Ensure to include user_token

    try {
        const db = await connectDatabase();
        const sql = `INSERT INTO user (email, user_token) 
                     VALUES (?, ?)`;

        const [result] = await db.execute(sql, [email, user_token]);

        res.json({ userId: result.insertId, message: 'User added successfully' });
    } catch (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Error inserting user', details: err });
    }
};

// Select Users (only emails)
exports.selectUserEmails = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT email FROM user`;

        const [results] = await db.execute(sql);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json({ emails: results.map(user => user.email) });
    } catch (err) {
        console.error('Error fetching user emails:', err);
        return res.status(500).json({ error: 'Error fetching user emails', details: err });
    }
};




