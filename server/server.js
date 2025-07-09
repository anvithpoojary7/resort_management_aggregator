const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectdb = require('./config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Grid = require('gridfs-stream');

const resortsearch=require('./routes/resortSearch');
const adminlogin=require('./routes/adminAuth');
const adminapproval=require('./routes/adminApproval');

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
 /* app.use('/api/owner',ownerRoutes);*/
  app.use('/api/adminapproval',adminapproval);
 app.use('/api/resortsearch', resortsearch);
 app.use('/api/admin/login',adminlogin);


  app.get("/api/resorts/image/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ err: "No file exists" });

    res.set("Content-Type", file.contentType);
    const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
    readstream.pipe(res);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.sendStatus(500);
  }
});

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
