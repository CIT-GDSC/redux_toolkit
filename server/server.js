require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


// Connect to MongoDB
connectDB();



// Middleware for parsing json and cookies
app.use(express.json());
app.use(cookieParser());

// Middleware for cors
app.use(cors(corsOptions));

// built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

mongoose.connection.once('open', () => { console.log('Connected to MongoDB') });
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
