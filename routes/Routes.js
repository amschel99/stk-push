const express = require("express");
const router=express.Router();
const {CreateToken, callBack,stkPush}= require('../controllers/Token.js')
router.post("/",CreateToken,stkPush)

router.post('/callback',callBack)
module.exports=router