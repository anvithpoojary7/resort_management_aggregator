const express=require('express');
const connectdb=require('./config/db');
const cors=require('cors');
const mainpage=require('./routes/mainpage');
const app=express();

app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend's origin (React/Next/etc.)
  credentials: true               // if using cookies or sessions
}));


require('dotenv').config();


connectdb();

app.use(express.json);


app.use('/api/resorts',mainpage);


const PORT = 5000;

app.listen(PORT,()=>{
   console.log(`server is running on  http://localhost:${PORT}`);

})
