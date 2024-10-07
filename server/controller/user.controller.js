const connectDatabase = require('../config/database.config');

// Add User
exports.addUser = async (req, res) => {
    const { email, profileImage, user_token } = req.body; // Ensure to include user_token

    try {
        const db = await connectDatabase(); // Establish a connection
        const sql = `INSERT INTO user (email, profileimage, user_token) 
                     VALUES (?, ?, ?)`; // Include user_token in the insert statement

        const [result] = await db.execute(sql, [email, profileImage, user_token]);

        res.json({ userId: result.insertId, message: 'User added successfully' });
    } catch (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Error inserting user', details: err });
    }
};


// Update User
exports.updateUser = async (req, res) => {
    const { userId, name, email, role, telephone, university, organization, profileImage } = req.body;

    try {
        const db = await connectDatabase(); // Establish a connection
        const sql = `UPDATE user
                     SET name = ?, email = ?,  profileimage = ? 
                     WHERE user_id = ?`;

        const [result] = await db.execute(sql, [name, email, role, telephone, university, organization, profileImage, userId]);

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Error updating user' });
    }
};
