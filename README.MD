# Running Frontend and Backend Concurrently

This project is a full-stack app with:

- 📦 **Frontend**: React (`/client`)
- 🛠️ **Backend**: Node.js + Express (`/server`)

---

## ✅ Prerequisites

Make sure you have **Node.js** and **npm** installed.

---

## 📦 Step 1: Install Dependencies

Install dependencies in all three places:

### 🔹 In root (for concurrently)

```bash
npm install
🔹 In client (React app)
bash
Copy
Edit
cd client
npm install
🔹 In server (Express backend)
bash
Copy
Edit
cd ../server
npm install
⚙️ Step 2: Add Scripts to Root package.json
Your root package.json should include:

json
Copy
Edit
"scripts": {
  "client": "cd client && npm start",
  "server": "cd server && node server.js",
  "dev": "concurrently \"npm run server\" \"npm run client\""
}
Also install concurrently:

bash
Copy
Edit
npm install concurrently --save-dev
🚀 Step 3: Run Both Together
From the root directory:

bash
Copy
Edit
npm run dev
Frontend runs at: http://localhost:3000

Backend runs at: http://localhost:5000

