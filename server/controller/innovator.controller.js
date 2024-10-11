const multer = require('multer');
const connectDatabase = require('../config/database.config');
const { v4: uuidv4 } = require('uuid');
const { getBucket, deleteFileFromBucket } = require('../config/firebase'); // Import getBucket and deleteFileFromBucket

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Create a new innovator
exports.addInnovator = async (req, res) => {
    const { innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email, video_link } = req.body;
    const file = req.file; // Get the uploaded image file (if any)

    try {
        let imageUrlWithToken = null; // Store image URL if file is uploaded

        if (file) {
            // Generate a unique download token for the image
            const downloadToken = uuidv4();

            // Get the Firebase Storage bucket
            const bucket = getBucket();

            // Create a reference for the image file in Firebase Storage
            const blob = bucket.file(`innovators/${Date.now()}_${file.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: downloadToken,
                    },
                },
            });

            // Handle stream errors
            blobStream.on('error', (err) => {
                console.error('Error uploading image:', err);
                return res.status(500).json({ error: 'Error uploading image', details: err });
            });

            // Finish uploading and retrieve image URL
            await new Promise((resolve, reject) => {
                blobStream.on('finish', () => {
                    imageUrlWithToken = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;
                    resolve();
                });
                blobStream.end(file.buffer);
            });
        }

        const db = await connectDatabase();
        const sql = `INSERT INTO innovator (innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email, video_link, image) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email, video_link, imageUrlWithToken]);

        res.status(201).json({ innovatorId: result.insertId, message: 'Innovator added successfully', image: imageUrlWithToken });
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
    const { innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email, video_link } = req.body;
    const file = req.file;

    try {
        let imageUrlWithToken = null;

        if (file) {
            // Generate a unique download token for the image
            const downloadToken = uuidv4();

            // Get the Firebase Storage bucket
            const bucket = getBucket();

            // Create a reference for the image file in Firebase Storage
            const blob = bucket.file(`innovators/${Date.now()}_${file.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: downloadToken,
                    },
                },
            });

            // Handle stream errors
            blobStream.on('error', (err) => {
                console.error('Error uploading image:', err);
                return res.status(500).json({ error: 'Error uploading image', details: err });
            });

            // Finish uploading and retrieve image URL
            await new Promise((resolve, reject) => {
                blobStream.on('finish', () => {
                    imageUrlWithToken = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;
                    resolve();
                });
                blobStream.end(file.buffer);
            });
        }

        const db = await connectDatabase();
        const sql = `UPDATE innovator 
                     SET innovator_name = ?, product_name = ?, innovation_category = ?, description = ?, proposal_link = ?, contact_no = ?, email = ?, video_link = ?, image = ?
                     WHERE innovator_id = ?`;
        const [result] = await db.execute(sql, [innovator_name, product_name, innovation_category, description, proposal_link, contact_no, email, video_link, imageUrlWithToken, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Innovator not found' });
        }

        res.json({ message: 'Innovator updated successfully', image: imageUrlWithToken });
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
        const sql = `SELECT image FROM innovator WHERE innovator_id = ?`;
        const [results] = await db.execute(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Innovator not found' });
        }

        // Delete the image from Firebase storage if it exists
        const imageUrl = results[0].image;
        if (imageUrl) {
            const fileName = imageUrl.split('/o/')[1].split('?')[0];
            await deleteFileFromBucket(fileName);
        }

        const deleteSql = `DELETE FROM innovator WHERE innovator_id = ?`;
        const [deleteResult] = await db.execute(deleteSql, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Innovator not found' });
        }

        res.json({ message: 'Innovator deleted successfully' });
    } catch (err) {
        console.error('Error deleting innovator:', err);
        return res.status(500).json({ error: 'Error deleting innovator', details: err });
    }
};

// Export the upload middleware for use in routes
exports.uploadInnovator = upload.single('image'); // Adjust the field name for the uploaded image
