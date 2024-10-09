const connectDatabase = require('../config/database.config');

// Create a new sponsor
exports.addSponsor = async (req, res) => {
    const { sponsor_name, email, contact_no, country } = req.body;

    try {
        const db = await connectDatabase();
        const sql = `INSERT INTO sponsorship (sponsor_name, email, contact_no, country) 
                     VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [sponsor_name, email, contact_no, country]);

        res.status(201).json({ sponsorId: result.insertId, message: 'Sponsor added successfully' });
    } catch (err) {
        console.error('Error inserting sponsor:', err);
        return res.status(500).json({ error: 'Error inserting sponsor', details: err });
    }
};

// Read all sponsors
exports.getAllSponsors = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM sponsorship`;
        const [results] = await db.execute(sql);

        res.json({ sponsors: results });
    } catch (err) {
        console.error('Error fetching sponsors:', err);
        return res.status(500).json({ error: 'Error fetching sponsors', details: err });
    }
};

// Read a specific sponsor by ID
exports.getSponsorById = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM sponsorship WHERE sponsor_id = ?`;
        const [results] = await db.execute(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }

        res.json({ sponsor: results[0] });
    } catch (err) {
        console.error('Error fetching sponsor:', err);
        return res.status(500).json({ error: 'Error fetching sponsor', details: err });
    }
};

// Update a sponsor
exports.updateSponsor = async (req, res) => {
    const { id } = req.params;
    const { sponsor_name, email, contact_no, country } = req.body;

    try {
        const db = await connectDatabase();
        const sql = `UPDATE sponsorship SET sponsor_name = ?, email = ?, contact_no = ?, country = ?
                     WHERE sponsor_id = ?`;
        const [result] = await db.execute(sql, [sponsor_name, email, contact_no, country, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }

        res.json({ message: 'Sponsor updated successfully' });
    } catch (err) {
        console.error('Error updating sponsor:', err);
        return res.status(500).json({ error: 'Error updating sponsor', details: err });
    }
};

// Delete a sponsor
exports.deleteSponsor = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectDatabase();
        const sql = `DELETE FROM sponsorship WHERE sponsor_id = ?`;
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }

        res.json({ message: 'Sponsor deleted successfully' });
    } catch (err) {
        console.error('Error deleting sponsor:', err);
        return res.status(500).json({ error: 'Error deleting sponsor', details: err });
    }
};
