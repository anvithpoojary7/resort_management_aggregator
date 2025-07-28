const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectdb = require('./config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Grid = require('gridfs-stream');


const adminlogin=require('./routes/adminAuth');
const adminapproval=require('./routes/adminApproval');
const filterResorts=require('./routes/resortSearch');

const adminRoutes = require('./routes/adminRoutes');

require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();

let gfs;
let upload;
let gridfsBucket;

// --- CORS Configuration STARTS HERE ---
// List of allowed domains
const allowedOrigins = [
  'http://localhost:3000', // Your local frontend
  'https://resort-management-aggregator.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // This is important for sending cookies
};

app.use(cors(corsOptions)); 

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


connectdb();
const conn = mongoose.connection;

conn.once('open', () => {
  console.log('✅ MongoDB connected');

  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');

  console.log('✅ GridFS initialized');

  
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

  const adminResortControl = require('./routes/adminResortControl');
  app.use('/api/admin/resorts', adminResortControl);
  
  const authRoutes = require('./routes/auth');
  const resortRoutesModule = require('./routes/resortRoutes');
  const userRoutes=require('./routes/userRoutes');
  const wishlistRoutes=require('./routes/wishlistRoutes');
  
   // --- ADD THIS LINE FOR WISHLIST ROUTES ---
  app.use('/api/wishlist', wishlistRoutes);
  // --- END ADDITION ---
  app.use('/api/user',userRoutes);
  
  app.use('/api/auth', authRoutes);
  app.use('/api/resorts', resortRoutesModule(gfs, upload, gridfsBucket));
 /* app.use('/api/owner',ownerRoutes);*/
 app.use('/api/filteresort',filterResorts);
 
  app.use('/api/adminapproval',adminapproval);
 
 app.use('/api/admin/login',adminlogin);

 app.use('/api/admin', adminRoutes);
 
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

app.get('/', (req, res) => {
  res.send('Resort Finder API is running successfully!');
});


  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

conn.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
  process.exit(1);
});
