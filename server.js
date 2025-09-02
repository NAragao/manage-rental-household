const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Debug: Check if .env is loaded
console.log('Firebase Project ID from .env:', process.env.PROJECT_ID);

const app = express();
const port = process.env.PORT || 3000;

// API endpoint to provide firebase config to the frontend
app.get('/api/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID
    });
});

// Serve the static site.html file
app.use(express.static(path.join(__dirname, '/')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
