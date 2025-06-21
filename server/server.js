const express=require('express');
const connectdb=require('./config/db');
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
