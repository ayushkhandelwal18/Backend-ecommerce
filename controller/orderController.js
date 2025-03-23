const Order=require('../models/orderModels');
const Product=require("../models/productModels.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError=require("../middleware/catchasyncError.js")

//create new order
exports.newOrder=catchAsyncError(async(req,res,next)=>{

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body;

    const order=await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id
    })

    res.status(200).json({
        success:true,
        order
    })
});

//get single order
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate('user','name email');

    if(!order){
        return next(new ErrorHandler("No Order found with this ID",404));
    }

    res.status(200).json({
        success:true,
        order
    })

});

//get logged in user order
exports.myOrders=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find({user:req.user.id});


    res.status(200).json({
        success:true,
        orders
    })

});

//get all orders -admin
exports.allOrders=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find();

    let totalAmount=0;

    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })

});

//update order status -admin
exports.updateOrderStatus=catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No Order found with this ID",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.quantity)
    })

    order.orderStatus=req.body.status;
   
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save(validateBeforeSave=false);

    res.status(200).json({
        success:true
    })


});

async function updateStock(id,quantity){

    const product=await Product.findById(id);

    product.stock = product.stock-quantity;

    await product.save({validateBeforeSave:false});
}


//delete order -admin
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No Order found with this ID",404));
    }

    await order.remove();

    res.status(200).json({
        success:true
    })

});