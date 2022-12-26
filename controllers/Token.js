const  axios =require("axios") ;
require("dotenv").config();
const PaymentModule = require('../models/PaymentModel')
let userMessage;
const CreateToken=async(req,res,next)=>{
      //getting the  auth ..by encoding both consumer key and consumerSecret
  
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
//AUTH
const auth  = new Buffer.from(`${consumerKey}:${secret}`).toString(
    "base64"
  );// this encodes the consume secret and consumer key using base64. the encoded string will be used to send a request to the safaricom api to give us an access token


  await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", { 
        
      headers: {
        authorization: `Basic ${auth}`,
      },
    }).then((data)=>{
        console.log(data.data.access_token);
        token=data.data.access_token
        next();//passing the token to the next middleware
    }).catch((err)=>{
        console.log(err.message);
    })
     
  };

const stkPush=async(req,res)=>{
    const phone = req.body.phone.substring(1);// removing the 0 from the number
    const amount = req.body.amount;
    // res.json({ phone, amount });
    //timestamp
    const date = new Date();
    const timeStamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + (date.getDate() + 1)).slice(-2) +
      ("0" + (date.getHours() + 1)).slice(-2) +
      ("0" + (date.getMinutes() + 1)).slice(-2) +
      ("0" + (date.getSeconds() + 1)).slice(-2);// time stamp  IN THE FORM OF YYYYMMDDHHmmss
  
    const shortCode = process.env.MPESA_PAYBILL;
    const passKey = process.env.MPESA_PASSKEY;
    const Url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"// where to send the stk push requestg
  
    //(The base64 string is a combination of Shortcode+Passkey+Timestamp)
    const password = new Buffer.from(shortCode + passKey + timeStamp).toString(
      "base64"
    );// THE PASSWORD IS A COMBINATION OF THIS 3 THINGS I.E BASE64 STRING
  //stk bodyy
 
  const Data={
    BusinessShortCode: shortCode,// ACTUAL PAYBILL
    Password:password,//COMBINING SHORTCODE,PASSKEY AND TIMESATAMP
    Timestamp: timeStamp,//time stamp  IN THE FORM OF YYYYMMDDHHmmss
    TransactionType: "CustomerPayBillOnline", //" OR CustomerBuyGoodsOnline"
    Amount: amount,
    PartyA: `254${phone}`,//USERS PHONE NUMBER
    PartyB: shortCode,// OUR PAY BILL
    PhoneNumber: `254${phone}`,//USERS PHONE NUMBER
    CallBackURL: "https://fdda-154-122-161-9.eu.ngrok.io/stk/callback",
    AccountReference: `Mota Automobiles`,
    TransactionDesc: "mota platform subscription",
  }
  await axios
  .post(Url,Data,{      
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response.data);
    res.status(200).json(response.data);
  }) .catch((err) => {
    console.log(err);
    res.status(400).json(err.message);
  });
}
const callBack=async(req,res)=>{
   //here mpesa sends the results of the transaction in req.body

    const  callbackData =req.body;
    console.log( callbackData);
    //callbackData.Body.stkCallback.CallbackMetadata
    if(! callbackData.Body.stkCallback.CallbackMetadata){
      //if something happened like a user cancelled the process, this code will run
        console.log( callbackData.Body.stkCallback.ResultDesc);
        userMessage=callbackData.Body.stkCallback.ResultDesc
      
    }
    const phone= callbackData.Body.stkCallback.CallbackMetadata.Item[4].Value
    const amount= callbackData.Body.stkCallback.CallbackMetadata.Item[0].Value
    const trnx_id= callbackData.Body.stkCallback.CallbackMetadata.Item[1].Value
console.log({phone,amount,trnx_id});

// we get this from mpesa itself and we save it to the database
try{
 const transaction =await PaymentModule.create({PhoneNumber:phone,amount:amount,trnx_id:trnx_id})
 console.log(transaction)
 //return res.json(transaction) we do not need to send saf anything
}
catch(error){
  console.log(error)
return;
}
  



}
const sendTransactionDetails= async (req,res)=>{
try{
const transaction= await PaymentModule.findOne({PhoneNumber:req.body.phone,trnx_id:req.body.id,amount:req.body.amount})
res.json(transaction)
}
catch(e){
console.log(e)
return;
}
}

module.exports={CreateToken ,stkPush,callBack,sendTransactionDetails}