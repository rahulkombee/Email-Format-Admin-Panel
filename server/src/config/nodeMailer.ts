// File: src/config/nodemailer.ts

import nodemailer from "nodemailer"; // This import will now work correctly
import dotenv from "dotenv";

// Load environment variables from your .env file
dotenv.config();

// --- Best Practice: Add a check for environment variables ---
// This ensures your application fails quickly if the config is missing.
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("FATAL ERROR: EMAIL_USER or EMAIL_PASS is not defined in the .env file.");
  process.exit(1); // This will stop the server from starting without proper credentials.
}


// Create a reusable transporter object using the SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Loaded from your .env file
    pass: process.env.EMAIL_PASS, // Loaded from your .env file
  },
});


export default transporter;