
const express=require('express');
const connectdb=require('./config/db');
const cors=require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // replace with your frontend's origin (React/Next/etc.)
  credentials: true               // if using cookies or sessions
}));


require('dotenv').config();

const app=express();
connectdb();

app.use(express.json);


app.get('/',(req,res)=>{
     res.send('api running');
})
const PORT = 5000;

app.listen(PORT,()=>{
   console.log(`server is running on  http://localhost:${PORT}`);

})
