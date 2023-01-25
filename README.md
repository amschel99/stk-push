## stk-push
### This project is an implementation of lipa na mpesa stk push in node JS.
### To get started follow the steps below:
``` git clone git@github.com:amschel99/stk-push.git ```

``` cd stk-push```

```npm install```

#### create a .env file to place your enviromental variables.

#### a quick hack in linux systems is ``` touch .env ```

#### Place your ```MPESA_CONSUMER_SECRET```, ```MPESA_CONSUMER_KEY```, ```PORT``` and ```MONGO_URI``` in the .env.

#### save you files and run your server by ```npm start```
#### Using a http client like postman, make a POST request to ```http://localhost:3000/stk```, i.e if your PORT is 3000.
#### include ``` 

"amount":"1",

"phone:"0790569556"  ``` 

in req.body.
#### You will get an stk push prompt to enter your pin.





