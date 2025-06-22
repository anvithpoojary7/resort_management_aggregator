const express = require('express');
const connectdb = require('./config/db');
const cors = require('cors');
const mainpage = require('./routes/mainpage');
const authRoutes = require('./routes/auth'); // ✅ NEW

const app = express();

require('dotenv').config();
connectdb();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json()); // ✅ Fixed

// Routes
app.use('/api/resorts', mainpage);
app.use('/api/auth', authRoutes); // ✅ Added

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
