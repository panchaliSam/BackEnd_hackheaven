const path = require("path");

const connectDatabase = require("../config/database.config");

exports.addHackathonEvent = async (req, res) => {
  console.log("helllo");
  const {
    organizationName:organization_name,
    hackathonName:hackathon_name,
    hackathonType:hackathon_type,
    finalEventDate:final_date,
    venue:location,
    country,
    phoneNumber:phone_no,
    email,
    proposalPDF:proposal_pdf
  } = req.body;

  // Basic validation
  if (
    !organization_name ||
    !hackathon_name ||
    !hackathon_type ||
    !final_date ||
    !location ||
    !country ||
    !phone_no ||
    !email ||
    !proposal_pdf
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = await connectDatabase();
    const sql = `
        INSERT INTO hackathon
        (organization_name, hackathon_name, hackathon_type, final_date, location, country, phone_no, email, proposal_pdf, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
        proposal_pdf,
    ]);
    res.json({ hackathonId: result.insertId, message: 'Hackathon event added successfully' });
  } catch (err) {
    console.error("Error inserting hackathon event:", err);
    return res
      .status(500)
      .json({ error: "Error inserting hackathon event", details: err });
  }
};

exports.updateHackathonEvent = async (req, res) => {
  const { hackathon_id } = req.query;


  const {
    hackathon_name,
    final_date,
    location,
    phone_no
  } = req.body;

  // Basic validation
  if (
    !hackathon_id ||
    !hackathon_name ||
    !final_date ||
    !location ||
    !phone_no
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = await connectDatabase();

    const sql = `
            UPDATE hackathon 
            SET hackathon_name = ?,  final_date = ?, location = ?,  phone_no = ?
            WHERE hackathon_id = ?
        `;

    await db.execute(sql, [
      hackathon_name,
      final_date,
      location,
      phone_no,
      hackathon_id
    ]);

    res.json({ message: "Hackathon event updated successfully" });
  } catch (err) {
    console.error("Error updating hackathon event:", err);
    return res
      .status(500)
      .json({ error: "Error updating hackathon event", details: err });
  }
};

exports.retrieveHackathonEventsByEmail = async (req, res) => {
  const { email } = req.query; // Get email from request parameters

  try {
    const db = await connectDatabase();

    const sql = `
      SELECT hackathon_id, hackathon_name, hackathon_type, final_date, location, phone_no
      FROM hackathon
      WHERE email = ?`; // Use email as the filter

    const [rows] = await db.execute(sql, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No hackathon events found for this email" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error retrieving hackathon events:", err);
    return res.status(500).json({ error: "Error retrieving hackathon events", details: err });
  }
};

exports.deleteHackathonEvent = async (req, res) => {
  const { hackathon_id } = req.query;

  // Basic validation
  if (!hackathon_id) {
    return res.status(400).json({ error: "Hackathon ID is required" });
  }

  try {
    const db = await connectDatabase();

    const sql = `
            DELETE FROM hackathon
            WHERE hackathon_id = ?
        `;

    const [result] = await db.execute(sql, [hackathon_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hackathon event not found" });
    }

    res.json({ message: "Hackathon event deleted successfully" });
  } catch (err) {
    console.error("Error deleting hackathon event:", err);
    return res
      .status(500)
      .json({ error: "Error deleting hackathon event", details: err });
  }
};

exports.getEventDetails = async (req, res) => {
  const { hackathon_id } = req.query;

  // Basic validation
  if (!hackathon_id) {
    return res.status(400).json({ error: "hackathon_id is required" });
  }

  try {
    const db = await connectDatabase();

    const sql = `
      SELECT organization_name, hackathon_name, hackathon_type, final_date, 
             location, country, phone_no, email, proposal_pdf
      FROM hackathon
      WHERE hackathon_id = ?`;

    const [rows] = await db.execute(sql, [hackathon_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    res.json(rows[0]); // Return the first result
  } catch (err) {
    console.error("Error fetching hackathon details:", err);
    return res.status(500).json({ error: "Error fetching hackathon details", details: err });
  }
};
