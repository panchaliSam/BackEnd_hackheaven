const path = require('path');

const connectDatabase = require('../config/database.config');

exports.addHackathonEvent = async (req, res) => {
    
    const {
        organizer_id,  
        organization_name,
        hackathon_name,
        hackathon_type,
        final_date,
        location,
        country,
        phone_no,
        email,
        proposal_pdf, 
        flyer_image   
    } = req.body;

    // Basic validation
    if (!organizer_id || !organization_name || !hackathon_name || !hackathon_type || !final_date || !location || !country || !phone_no || !email || !proposal_pdf || !flyer_image) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await connectDatabase();

        const sql = `
            INSERT INTO hackathon
            (organizer_id, organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf, flyer_image, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const [result] = await db.execute(sql, [
            organizer_id,
            organization_name,
            hackathon_name,
            hackathon_type,
            final_date,
            location,
            country,
            phone_no,
            email,
            proposal_pdf,  
            flyer_image    
        ]);

        res.json({ hackathonId: result.insertId, message: 'Hackathon event added successfully' });
    } catch (err) {
        console.error('Error inserting hackathon event:', err);
        return res.status(500).json({ error: 'Error inserting hackathon event', details: err });
    }
};


exports.updateHackathonEvent = async (req, res) => {
    const {
        hackathon_id,  
        organizer_id,  
        organization_name,
        hackathon_name,
        hackathon_type,
        final_date,
        location,
        country,
        phone_no,
        email,
        proposal_pdf, 
        flyer_image   
    } = req.body;

    // Basic validation
    if (!hackathon_id || !organizer_id || !organization_name || !hackathon_name || !hackathon_type || !final_date || !location || !country || !phone_no || !email || !proposal_pdf || !flyer_image) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await connectDatabase();

        const sql = `
            UPDATE hackathon 
            SET organizer_id = ?, organization_name = ?, hackathon_name = ?, hackathon_type = ?, final_date = ?, location = ?, country = ?, phone_no = ?, email = ?, proposal_pdf = ?, flyer_image = ?
            WHERE hackathon_id = ?
        `;

        await db.execute(sql, [
            organizer_id,
            organization_name,
            hackathon_name,
            hackathon_type,
            final_date,
            location,
            country,
            phone_no,
            email,
            proposal_pdf,  
            flyer_image,   
            hackathon_id   
        ]);

        res.json({ message: 'Hackathon event updated successfully' });
    } catch (err) {
        console.error('Error updating hackathon event:', err);
        return res.status(500).json({ error: 'Error updating hackathon event', details: err });
    }
};


exports.retrieveHackathonCardDetails = async (req, res) => {
    const { hackathon_id } = req.params;

    // Basic validation
    if (!hackathon_id) {
        return res.status(400).json({ error: 'Hackathon ID is required' });
    }

    try {
        const db = await connectDatabase();

        const sql = `
            SELECT hackathon_name, hackathon_type, final_date, location
            FROM hackathon
            WHERE hackathon_id = ?
        `;

        const [rows] = await db.execute(sql, [hackathon_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Hackathon event not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error retrieving hackathon card details:', err);
        return res.status(500).json({ error: 'Error retrieving hackathon card details', details: err });
    }
};


exports.deleteHackathonEvent = async (req, res) => {
    const { hackathon_id } = req.params;

    // Basic validation
    if (!hackathon_id) {
        return res.status(400).json({ error: 'Hackathon ID is required' });
    }

    try {
        const db = await connectDatabase();

        const sql = `
            DELETE FROM hackathon
            WHERE hackathon_id = ?
        `;

        const [result] = await db.execute(sql, [hackathon_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Hackathon event not found' });
        }

        res.json({ message: 'Hackathon event deleted successfully' });
    } catch (err) {
        console.error('Error deleting hackathon event:', err);
        return res.status(500).json({ error: 'Error deleting hackathon event', details: err });
    }
};


