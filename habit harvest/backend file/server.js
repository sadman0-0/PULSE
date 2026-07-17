// Import required packages
const express = require("express");
const cors = require("cors");

// Create Express application
const app = express();

// Server Port
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.send("🌱 Welcome to Habit Harvest Backend!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});