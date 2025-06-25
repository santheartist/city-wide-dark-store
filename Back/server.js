const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { default: axios } = require('axios');


// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'avishkar_hack',
    password: 'Gladiator@1204',
    database: 'avishkar_hackron',
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Default route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});


// Get all stores
app.get('/api/stores', (req, res) => {
    const query = 'SELECT * FROM store';
    db.query(query, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error fetching stores');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/api/possible-stores', (req, res) => {
    axios.post('http://127.0.0.1:8000/analyze-impact', {
        "latitude": 18.55015100,
        "longitude": 73.88848300,
        "n_clusters": 3,
        "min_distance_km": 10
    }).then((responce) => {
      console.log(responce.data)
        res.json(responce.data)
    }).catch((err)=>{
        console.log(err.msg)
    })
});



// Create Nodemailer transporter to send OTP emails
const transporter = nodemailer.createTransport({
  service: "gmail",  // Or your email provider
  auth: {
    user: "tejasgophane4142@gmail.com",  // Replace with your email
    pass: "uxfq dzhq bmbm aykw", // Replace with your app password
  },
});

// Temporary in-memory storage for OTPs (for demonstration, consider using a session or a database)
let otpStore = {};  // Stores OTPs based on email

// Function to send OTP via email
const sendOtpEmail = (email, otp) => {
  // Log OTP to console
  console.log(`Sending OTP: ${otp} to ${email}`);  // Print the OTP in the server console

  const mailOptions = {
    from: "tejasgophane4142@gmail.com",  // Sender email
    to: email,                    // Recipient email
    subject: "Your OTP for Login", // Subject
    text: `Your OTP for login is: ${otp}`, // Email body
  };

  return transporter.sendMail(mailOptions);
};

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Ensure email is provided
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  // Query to check user credentials
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (result.length > 0) {
      // User found, login successful
      const user = result[0];

      // Generate 5-digit OTP
      const otp = Math.floor(10000 + Math.random() * 90000);  // 5-digit OTP
      console.log(`Generated OTP: ${otp}`);  // Log the generated OTP

      // Store OTP temporarily
      otpStore[email] = otp;
      console.log(`Stored OTP for ${email}: ${otpStore[email]}`);  // Log the OTP stored for the user

      // Send OTP to user's email
      sendOtpEmail(user.email, otp)
        .then(() => {
          res.json({ success: true, message: "OTP sent to your email" });
        })
        .catch((err) => {
          console.error("Error sending OTP email:", err);
          res.status(500).json({ success: false, message: "Error sending OTP" });
        });
    } else {
      // Invalid credentials
      res.json({ success: false, message: "Invalid email or password" });
    }
  });
});

// OTP verification route
app.post("/api/verify-otp", (req, res) => {
  const { email, userOtp } = req.body;

  // Ensure OTP and email are provided
  if (!email || !userOtp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  console.log("Received OTP: ", userOtp);  // Debugging log for received OTP

  // Check if OTP matches
  if (otpStore[email] && otpStore[email] === parseInt(userOtp)) {
    // OTP is valid
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    // Invalid OTP
    res.json({ success: false, message: "Invalid OTP" });
  }
});


// API endpoint to get store count
app.get('/api/stores/count', (req, res) => {
  const query = 'SELECT COUNT(*) AS totalStores FROM Store'; // Adjust the table name if needed

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching store count:', err);
      return res.status(500).json({ message: 'Error fetching store count' });
    }
    const totalStores = results[0].totalStores;
    res.json({ totalStores });
  });
});



// Server setup
app.listen();

