const connectDatabase = require('../config/database.config');

// Create a new innovator
exports.addInnovator = async (req, res) => {
    const { innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email } = req.body;

    try {
        const db = await connectDatabase();
        const sql = `INSERT INTO innovator (innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email]);
        
        res.status(201).json({ innovatorId: result.insertId, message: 'Innovator added successfully' });
    } catch (err) {
        console.error('Error inserting innovator:', err);
        return res.status(500).json({ error: 'Error inserting innovator', details: err });
    }
};

// Read all innovators
exports.getAllInnovators = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM innovator`;
        const [results] = await db.execute(sql);
        
        res.json({ innovators: results });
    } catch (err) {
        console.error('Error fetching innovators:', err);
        return res.status(500).json({ error: 'Error fetching innovators', details: err });
    }
};

// Read a specific innovator by ID
exports.getInnovatorById = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM innovator WHERE innovator_id = ?`;
        const [results] = await db.execute(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Innovator not found' });
        }

        res.json({ innovator: results[0] });
    } catch (err) {
        console.error('Error fetching innovator:', err);
        return res.status(500).json({ error: 'Error fetching innovator', details: err });
    }
};

// Update an innovator
exports.updateInnovator = async (req, res) => {
    const { id } = req.params;
    const { innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email } = req.body;

    try {
        const db = await connectDatabase();
        const sql = `UPDATE innovator 
                     SET innovator_name = ?, product_name = ?, innovation_category = ?, description = ?, proposal_link = ?, contact_no = ?, email = ?
                     WHERE innovator_id = ?`;
        const [result] = await db.execute(sql, [innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Innovator not found' });
        }

        res.json({ message: 'Innovator updated successfully' });
    } catch (err) {
        console.error('Error updating innovator:', err);
        return res.status(500).json({ error: 'Error updating innovator', details: err });
    }
};

// Delete an innovator
exports.deleteInnovator = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await connectDatabase();
        const sql = `DELETE FROM innovator WHERE innovator_id = ?`;
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Innovator not found' });
        }

        res.json({ message: 'Innovator deleted successfully' });
    } catch (err) {
        console.error('Error deleting innovator:', err);
        return res.status(500).json({ error: 'Error deleting innovator', details: err });
    }
};
