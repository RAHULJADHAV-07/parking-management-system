// This file serves as an entry point for the backend server
const path = require('path');

// Import and run the actual server from the parking-backend directory
require(path.join(__dirname, 'parking-backend', 'server.js'));