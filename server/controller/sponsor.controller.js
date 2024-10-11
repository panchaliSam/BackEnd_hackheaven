const multer = require('multer');
const admin = require('firebase-admin');
const connectDatabase = require('../config/database.config');
const serviceAccount = require('../config/serviceAccountKey.json');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "hackheaven-1a9c2.appspot.com" // Replace with your Firebase Storage bucket name
});

const bucket = admin.storage().bucket();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Add sponsor
exports.addSponsor = async (req, res) => {
    const { sponsor_name, email, contact_no, country, category } = req.body;
    const file = req.file; // Get the uploaded file

    if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
    }

    try {
        // Generate a unique download token (UUID)
        const downloadToken = uuidv4();

        // Create a reference for the file in Firebase Storage
        const blob = bucket.file(`logos/${Date.now()}_${file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: downloadToken, // Manually set the download token
                },
            },
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Error uploading image', details: err });
        });

        blobStream.on('finish', async () => {
            // Get the public URL of the uploaded image with the access token (download URL)
            const imageUrlWithToken = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;

            // Insert sponsor details into the database, including the image URL with access token
            const db = await connectDatabase();
            const sql = `INSERT INTO sponsorship (sponsor_name, email, contact_no, country, category, logo) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
            const [result] = await db.execute(sql, [sponsor_name, email, contact_no, country, category, imageUrlWithToken]);

            res.status(201).json({ sponsorId: result.insertId, message: 'Sponsor added successfully', logo: imageUrlWithToken });
        });

        blobStream.end(file.buffer); // End the stream
    } catch (err) {
        console.error('Error inserting sponsor:', err);
        return res.status(500).json({ error: 'Error inserting sponsor', details: err });
    }
};

// Select all companies
exports.getAllSponsors = async (req, res) => {
    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM sponsorship`; // Fetch all sponsor details
        const [results] = await db.execute(sql);

        // Assuming the 'logo' field contains the image URL, no extra processing is needed
        const sponsors = results.map(sponsor => ({
            sponsor_id: sponsor.sponsor_id,
            sponsor_name: sponsor.sponsor_name,
            email: sponsor.email,
            contact_no: sponsor.contact_no,
            country: sponsor.country,
            category: sponsor.category,
            logo: sponsor.logo // This contains the Firebase Storage URL with the download token
        }));

        // Return the sponsor data with the logo URLs directly
        res.json({ sponsors });
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
        const sql = `SELECT * FROM sponsorship WHERE sponsor_id = ?`; // Select all columns, including category
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
    const { sponsor_name, email, contact_no, country, category } = req.body;

    try {
        const db = await connectDatabase();
        const sql = `UPDATE sponsorship SET sponsor_name = ?, email = ?, contact_no = ?, country = ?, category = ?
                     WHERE sponsor_id = ?`;
        const [result] = await db.execute(sql, [sponsor_name, email, contact_no, country, category, id]);

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

// Search sponsors by category (case-insensitive) using query parameter
exports.searchSponsorsByCategory = async (req, res) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({ error: 'Category is required' });
    }

    try {
        const db = await connectDatabase();
        const sql = `SELECT * FROM sponsorship WHERE LOWER(category) LIKE LOWER(?)`;
        const [results] = await db.execute(sql, [`%${category}%`]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No sponsors found for this category' });
        }

        res.json({ sponsors: results });
    } catch (err) {
        console.error('Error searching sponsors by category:', err);
        return res.status(500).json({ error: 'Error searching sponsors by category', details: err });
    }
};

// Export the upload middleware for use in routes
exports.upload = upload.single('logo'); // Adjust the field name as necessary
