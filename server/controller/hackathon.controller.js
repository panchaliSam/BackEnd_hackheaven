const { connectDatabase } = require('../database'); // Adjust the import based on your project structure

// Add a Hackathon
exports.addHackathon = async (req, res) => {
    const { organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf } = req.body;
    try {
        const db = await connectDatabase();
        const sql = `INSERT INTO hackathon (organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf]);
        res.status(201).json({ hackathonId: result.insertId, message: 'Hackathon added successfully' });
    } catch (err) {
        console.error('Error inserting hackathon:', err);
        return res.status(500).json({ error: 'Error inserting hackathon', details: err });
    }
};

// Get All Hackathons
exports.getAllHackathons = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM hackathon`;
        const [results] = await db.execute(sql);
        res.json({ hackathons: results });
    } catch (err) {
        console.error('Error fetching hackathons:', err);
        return res.status(500).json({ error: 'Error fetching hackathons', details: err });
    }
};

// Get a Hackathon by ID
exports.getHackathonById = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM hackathon WHERE hackathon_id = ?`;
        const [results] = await db.execute(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }
        res.json({ hackathon: results[0] });
    } catch (err) {
        console.error('Error fetching hackathon:', err);
        return res.status(500).json({ error: 'Error fetching hackathon', details: err });
    }
};

// Update a Hackathon
exports.updateHackathon = async (req, res) => {
    const { id } = req.params;
    const { organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf } = req.body;
    try {
        const db = await connectDatabase();
        const sql = `UPDATE hackathon 
                     SET organization_name = ?, hackathon_name = ?, hackathon_type = ?, final_date = ?, location = ?, country = ?, phone_no = ?, email = ?, proposal_pdf = ?
                     WHERE hackathon_id = ?`;
        const [result] = await db.execute(sql, [organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }
        res.json({ message: 'Hackathon updated successfully' });
    } catch (err) {
        console.error('Error updating hackathon:', err);
        return res.status(500).json({ error: 'Error updating hackathon', details: err });
    }
};

// Delete a Hackathon
exports.deleteHackathon = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await connectDatabase();
        const sql = `DELETE FROM hackathon WHERE hackathon_id = ?`;
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }
        res.json({ message: 'Hackathon deleted successfully' });
    } catch (err) {
        console.error('Error deleting hackathon:', err);
        return res.status(500).json({ error: 'Error deleting hackathon', details: err });
    }
};

// Search Hackathons by Type
exports.searchHackathonsByType = async (req, res) => {
    const { type } = req.query; // Assuming the type is passed as a query parameter
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM hackathon WHERE hackathon_type = ?`;
        const [results] = await db.execute(sql, [type]);
        res.json({ hackathons: results });
    } catch (err) {
        console.error('Error searching hackathons by type:', err);
        return res.status(500).json({ error: 'Error searching hackathons by type', details: err });
    }
};

// Search Hackathons by Name
exports.searchHackathonsByName = async (req, res) => {
    const { name } = req.query; // Assuming the name is passed as a query parameter
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM hackathon WHERE hackathon_name LIKE ?`;
        const [results] = await db.execute(sql, [`%${name}%`]);
        res.json({ hackathons: results });
    } catch (err) {
        console.error('Error searching hackathons by name:', err);
        return res.status(500).json({ error: 'Error searching hackathons by name', details: err });
    }
};

// Fetch All Unique Hackathon Types
exports.getAllHackathonTypes = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT DISTINCT hackathon_type FROM hackathon`;
        const [results] = await db.execute(sql);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No hackathon types found' });
        }
        res.json({ hackathonTypes: results });
    } catch (err) {
        console.error('Error fetching hackathon types:', err);
        return res.status(500).json({ error: 'Error fetching hackathon types', details: err });
    }
};
