const express = require("express");
const router=express.Router();
const {CreateToken, callBack,stkPush,sendTransactionDetails}= require('../controllers/Token.js')
router.post("/",CreateToken,stkPush)

router.post('/callback',callBack)
router.post("/details",sendTransactionDetails)
module.exports=router