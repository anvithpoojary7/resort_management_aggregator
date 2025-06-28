const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectdb = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth');


const app = express();

// Connect to MongoDB
connectdb();

// Middleware
app.use(cors({
  origin:true,
  
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);


// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});