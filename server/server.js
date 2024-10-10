const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require("./config/database.config");
const routes = require("./routes");

dotenv.config();

// Express app
const app = express();
const port = process.env.PORT || 4002;

// Middleware
app.use(cors({
    origin: [
        `http://localhost:8081`, // Allow localhost for web
        `exp://192.168.1.9:8081`
    ], // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization' // Allowed headers
}));
app.use(express.json()); // To parse JSON bodies

// MySQL connection
connectDatabase().then(() => {
    console.log('Connected to the MySQL database successfully!');

    // Use routes after successful connection
    app.use(routes);

    // Start the server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
