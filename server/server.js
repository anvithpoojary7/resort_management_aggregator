require('dotenv').config();
const mongoose = require('mongoose');

// Log just to confirm this runs
console.log("🚀 Starting server.js...");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

