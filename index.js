const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');

const Payee= require("./routes/Routes");
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/stk',Payee)
const Port =  process.env.PORT;



mongoose.connect(process.env.MONGO_URL).then(()=>{
  app.listen(Port, () => {
  console.log(`app is listening on port :${Port}`);
}); 
}).catch((err)=>{
    console.error(err.message);
})





