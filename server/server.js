require('dotenv').config(); 
const express = require('express');
const db = require('./config');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('MySQL Connection Test - Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
