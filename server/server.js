const express = require('express');
const connectdb = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth'); // ✅ NEW

const app = express();

require('dotenv').config();
connectdb();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json()); 

// Routes

app.use('/api/auth', authRoutes); 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
