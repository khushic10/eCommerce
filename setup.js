const fs = require("fs");
const crypto = require("crypto");

// Generate a random JWT_SECRET
const jwtSecret = crypto.randomBytes(32).toString("hex");

// Store the JWT_SECRET in an environment variable
process.env.JWT_SECRET = jwtSecret;

console.log("JWT_SECRET:", jwtSecret);
