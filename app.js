const express = require('express');
const app=express();

const cookieParser=require('cookie-parser');

const errorMiddleware=require("./middleware/error")

app.use(express.json())
app.use(cookieParser())

//route imports
const product=require("./routes/productRoute");
const customer=require("./routes/userroutes");
const order=require("./routes/orderRoute");

app.use("/api/v1",product)
app.use("/api/v1",customer)
app.use("/api/v1",order)

//middleware for error
app.use(errorMiddleware);


module.exports=app