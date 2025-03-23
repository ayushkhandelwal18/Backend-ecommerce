const ErrorHandler = require("../utils/errorhandler");
const catchAsyncerror=require("./catchasyncError");
const jwt = require('jsonwebtoken');
const User = require("../models/usermodels");

exports.isAuthenticatedUser =catchAsyncerror(async(req,res,next)=>{

    const {token} = req.cookies;
   

    if(!token){
        return next(new ErrorHandler("Login first to access this resource",401));
    }
     const decodeData =jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
     
    });

exports.authorizedRoles = (...roles)=>{

    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
         return next(   new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resource`,403
            )
            );
        }
        next();
    };
};
