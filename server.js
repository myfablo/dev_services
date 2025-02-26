const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/configs/db');
const routes = require('./src/routes');
const { errorMiddleware, notFoundMiddleware } = require('./src/middlewares/errorMiddleware');
const updateChargerStatus = require('./src/jobs/updateChargerStatus');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', routes);

// Start charger status update job
updateChargerStatus(); // Runs immediately on startup

// Route Not Found Middleware (Must be before errorMiddleware)
app.use(notFoundMiddleware);

// Error Handling Middleware (Handles all errors)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
