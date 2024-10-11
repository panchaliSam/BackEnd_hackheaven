const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const { getBucket } = require('../config/firebase'); // Import your Firebase Singleton
const connectDatabase = require('../config/database.config'); // Adjust the path to your database config

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Add a Hackathon
// Add a Hackathon
exports.addHackathon = async (req, res) => {
    const { organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf } = req.body;
    const logoFile = req.file; // Get the uploaded logo file

    if (!logoFile) {
        return res.status(400).json({ error: 'Logo image is required' });
    }

    try {
        const bucket = getBucket(); // Get the Firebase Storage bucket instance

        // Generate a unique download token (UUID)
        const downloadToken = uuidv4();

        // Create a reference for the logo in Firebase Storage
        const blob = bucket.file(`logos/${Date.now()}_${logoFile.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: logoFile.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: downloadToken, // Manually set the download token
                },
            },
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading logo:', err);
            return res.status(500).json({ error: 'Error uploading logo', details: err });
        });

        blobStream.on('finish', async () => {
            // Get the public URL of the uploaded logo with the access token (download URL)
            const logoUrlWithToken = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;

            // Prepare values for database insertion
            const db = await connectDatabase();
            const sql = `INSERT INTO hackathon (organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf, logo) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            // Ensure all values are defined; replace undefined with null
            const values = [
                organization_name || null,
                hackathon_name || null,
                hackathon_type || null,
                final_date || null,
                location || null,
                country || null,
                phone_no || null,
                email || null,
                proposal_pdf || null,
                logoUrlWithToken || null
            ];

            const [result] = await db.execute(sql, values);

            res.status(201).json({ hackathonId: result.insertId, message: 'Hackathon added successfully', logo: logoUrlWithToken });
        });

        blobStream.end(logoFile.buffer); // End the stream
    } catch (err) {
        console.error('Error inserting hackathon:', err);
        return res.status(500).json({ error: 'Error inserting hackathon', details: err });
    }
};


// Get All Hackathons
exports.getAllHackathons = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM hackathon`; // Fetch all hackathon details
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
        const sql = `SELECT * FROM hackathon WHERE hackathon_id = ?`; // Fetch hackathon by ID
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
    const logoFile = req.file; // Get the uploaded logo file

    try {
        const db = await connectDatabase();

        let logoUrlWithToken;
        if (logoFile) {
            // Upload the new logo file to Firebase Storage
            const bucket = getBucket();
            const downloadToken = uuidv4();
            const blob = bucket.file(`HackathonImages/${Date.now()}_${logoFile.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: logoFile.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: downloadToken,
                    },
                },
            });

            // Wait for the blob stream to finish before proceeding
            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    console.error('Error uploading logo:', err);
                    reject(err);
                });

                blobStream.on('finish', () => {
                    logoUrlWithToken = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;
                    resolve();
                });

                blobStream.end(logoFile.buffer); // End the stream
            });
        }

        const sql = `UPDATE hackathon 
                     SET organization_name = ?, hackathon_name = ?, hackathon_type = ?, final_date = ?, location = ?, country = ?, phone_no = ?, email = ?, proposal_pdf = ?, logo = ?
                     WHERE hackathon_id = ?`;
        const [result] = await db.execute(sql, [
            organization_name,
            hackathon_name,
            hackathon_type,
            final_date,
            location,
            country,
            phone_no,
            email,
            proposal_pdf,
            logoUrlWithToken || null,
            id
        ]);

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

// Middleware for uploading logo
exports.uploadHackathonLogo = upload.single('logo'); // Adjust the field name if different
