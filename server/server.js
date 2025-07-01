// server/server.js (main Express app file)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const cookieParser = require('cookie-parser'); // <--- NEW: Import cookie-parser

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend origin
  credentials: true, // IMPORTANT: Allow cookies to be sent from frontend
}));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // <--- NEW: Use cookie-parser middleware to parse incoming cookies

// MongoDB Connection
let gfs, gridfsBucket;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    const conn = mongoose.connection;
    // Initialize gfs and gridfsBucket AFTER successful connection
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // Specify the collection name for GridFS files

    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads' // This must match the collection name used by gfs.collection
    });
  })
  .catch(err => console.error(err));

// Create GridFS storage engine for Multer
const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `image-${Date.now()}${path.extname(file.originalname)}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads', // Must match the collection name
      };
      resolve(fileInfo);
    });
  },
});
const upload = multer({ storage });


// Import routes
const resortRoutes = require('./routes/resortRoutes');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api/resorts', resortRoutes(gfs, upload, gridfsBucket)); // Pass gfs, upload, gridfsBucket
app.use('/api/auth', authRoutes); // Use auth routes (e.g., /api/auth/register, /api/auth/login)


// Route to serve images from GridFS
app.get('/api/resorts/image/:filename', async (req, res) => {
  try {
    if (!gfs || !gridfsBucket) { // Ensure GridFS is initialized
        return res.status(500).json({ message: 'GridFS not initialized.' });
    }
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'No file exists with that filename.' });
    }
    if (file.contentType && file.contentType.startsWith('image/')) {
      const readstream = gridfsBucket.openDownloadStreamByName(file.filename);
      readstream.pipe(res);
    } else {
      res.status(400).json({ message: 'File is not an image.' });
    }
  } catch (err) {
    console.error('Error serving image:', err);
    res.status(500).json({ message: 'Error serving image.' });
  }
});


// Basic error handling middleware (optional but recommended for catching unhandled errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});