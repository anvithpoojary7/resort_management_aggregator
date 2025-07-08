const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectdb = require('./config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Grid = require('gridfs-stream');


require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();

// Connect MongoDB
connectdb();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let gfs;
let gridfsBucket;
let upload;

// Wait for MongoDB connection
const conn = mongoose.connection;
conn.once('open', () => {
  console.log('✅ MongoDB connected');

  // Initialize GridFS
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('✅ GridFS initialized');

  // Set up Multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `image-${Date.now()}-${file.originalname}`);
    },
  });
  upload = multer({ storage });
  console.log('✅ Multer disk upload ready');

  // Import route files
  const authRoutes = require('./routes/auth');
  const resortRoutesModule = require('./routes/resortRoutes');
  const imageRoutes = require('./routes/image'); // ✅ new
  const adminLoginRoutes = require('./routes/adminAuth');
  const adminApprovalRoutes = require('./routes/adminApproval');
  const filterResortsRoutes = require('./routes/resortSearch');
  const ownerProfile=require('./routes/ownerProfile');

  // Use routes
  app.use('/api/auth', authRoutes);
  app.use('/api/resorts', resortRoutesModule(gfs, upload, gridfsBucket));
  app.use('/api/image', imageRoutes(gfs, gridfsBucket)); // ✅ new
  app.use('/api/admin/login', adminLoginRoutes);
  app.use('/api/adminapproval', adminApprovalRoutes);
  app.use('/api/fiteresort', filterResortsRoutes);
  app.use('/api/owner', ownerProfile);

  // Start server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

// Handle MongoDB connection errors
conn.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
  process.exit(1);
});
