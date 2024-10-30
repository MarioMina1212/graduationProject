require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const appError = require('./utils/appError');
const UserRouter =require('./routes/users')
const httpStatusText = require('./utils/http.status.text');
const app = express();
const url =process.env.MONGO_URL
const port = process.env.PORT
app.use(express.json());
app.use(cors());

mongoose.connect(url)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log(err));

app.use("/api",UserRouter)
app.use ("/login",((req,res,next)=>{
    res.status(200).json({message:"login successfully"})
}))
  
app.use((error,req,res,next)=>{
  res.status(error.statusCode || 500).json({status:httpStatusText.ERROR|| httpStatusText.ERROR,message:error.message,code:error.statusCode || 500,data:null })
})
app.listen(port, () => {
  console.log('Server running on port 5000');
});
