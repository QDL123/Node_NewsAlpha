// Import required packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Construct express app
const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Declare routes
const analyzeRouter = require('./routes/analyze/index.js');

// Add routes to the app
app.use('/analyze', analyzeRouter);
// app.use(app.router);
// routes.initialize(app);

module.exports = app;