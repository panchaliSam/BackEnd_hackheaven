const multer = require('multer');
const path = require('path');

const connectDatabase = require('../config/database.config');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store the PDFs
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.extname(file.originalname)); // Timestamp for unique filenames
    }
});

const upload = multer({ storage: storage }).single('proposal_pdf');

//Register organizer
exports.registerOrganizer = async (req, res) => {
    // Handle file upload
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: 'Error uploading file', details: err });
        }

        // Destructure the organizer details from the request body
        const {
            organization_name,
            hackathon_name,
            hackathon_type,
            final_date,
            location,
            country,
            phone_no,
            email
        } = req.body;

        const proposal_pdf = req.file ? req.file.filename : null; // Check if the file was uploaded

        // Basic validation
        if (!organization_name || !hackathon_name || !hackathon_type || !final_date || !location || !country || !phone_no || !email || !proposal_pdf) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Establish a connection to the database
            const db = await connectDatabase();

            // Insert organizer data into the database
            const sql = `
                INSERT INTO organizers 
                (organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await db.execute(sql, [
                organization_name,
                hackathon_name,
                hackathon_type,
                final_date,
                location,
                country,
                phone_no,
                email,
                proposal_pdf
            ]);

            // Respond with success
            res.json({ organizerId: result.insertId, message: 'Organizer added successfully' });
        } catch (err) {
            console.error('Error inserting organizer:', err);
            return res.status(500).json({ error: 'Error inserting organizer', details: err });
        }
    });
};

