const express = require('express');
const connectdb = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ✅ Added

const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
connectdb();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

<<<<<<< Updated upstream
app.use(express.json()); 
=======
app.use(express.json());
app.use(cookieParser()); // ✅ Add this for reading cookies
>>>>>>> Stashed changes

// Global Debug Middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

<<<<<<< Updated upstream
app.use('/api/auth', authRoutes); 
=======
app.use('/api/auth', authRoutes);

>>>>>>> Stashed changes
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
