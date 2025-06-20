// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Add this line
// import { getAnalytics } from "firebase/analytics"; ❌ remove or comment this if not needed

const firebaseConfig = {
  apiKey: "AIzaSyDpeMEDJ7KUdFK_qL5rDzc5bBOWevU96DM",
  authDomain: "resort-management-aggregator.firebaseapp.com",
  projectId: "resort-management-aggregator",
  storageBucket: "resort-management-aggregator.appspot.com", // ✅ fix: should be firebasestorage.googleapis.com or just ".appspot.com"
  messagingSenderId: "733444687795",
  appId: "1:733444687795:web:8b42a79064f60542e92dc6",
  measurementId: "G-WKBW13HWBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Export these
export { auth, provider };