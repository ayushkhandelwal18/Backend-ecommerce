const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError=require("../middleware/catchasyncError.js");

const uuser=require("../models/usermodels.js");
const sendToken = require("../utils/jwtToken.js");

const sendEmail = require("../utils/sendEmail.js");

const crypto = require("crypto");

//register ya signup
exports.signup=catchAsyncError(async(req,res,next)=>{
    const{name,email,password}=req.body;
    const user =await uuser.create({
        name,email,password,
        avtar:{
            public_id:"this is a sample",
            url:"profileurl"
        },
    });

    sendToken(user,201,res);

});

//login ya signin

exports.signin=catchAsyncError(async(req,res,next)=>{

    const{email,password}=req.body;

    //check if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',400));
    }

    const user= await uuser.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email or password',401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid email or password',401));
    }   

    sendToken(user,200,res);
  

});

//logout user
exports.logout=catchAsyncError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

     res.status(200).json({
        success:true,
        message:"logged out",
     })

});

//forgot password

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

    const user =await uuser.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //get reset password token
    const resetToken=user.resetPasswordToken();
  
    await user.save({validateBeforeSave:false});

    const resetpasswordUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
      
    const message =`Your password reset token is : \n\n${resetpasswordUrl}b\n\nIf you have not requested this email, then ignore it.`;

     try{

        await sendEmail({
            email:user.email,
            subject:"ShopIT Password Recovery",
            message
        });

        res.status(200).json({
            success:true,
            message:`Email sent to: ${user.email}`
        });

     } catch(error){
            user.resetPasswordExpire=undefined;
            user.resetPasswordToken=undefined;
           
    
            await user.save({validateBeforeSave:false});
            return next(new ErrorHandler(error.message,500));
     }
});

//reset password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

     //creating token hash
        const resetPasswordToken=crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest('hex');

         const user=await uuser.findOne({
            
             resetPasswordToken,
             resetPasswordExpire:{$gt:Date.now()} //gretaer that date.now
         });

          console.log(user);

         if(!user){
          return next(new ErrorHandler("reset password token is invalid or has been expired",404));
        }

        if(req.body.password != req.body.confirmpassword){
            return next(new ErrorHandler("Password does not match",400));
        }

        user.password=req.body.password;

        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save();

        sendToken(user,200,res); //login ke liye hai 
});

//get user details

exports.getUserProfile=catchAsyncError(async(req,res,next)=>{

    const user = await uuser.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });

});

//update password
exports.updatePassword=catchAsyncError(async(req,res,next)=>{

    const user = await uuser.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched=await user.comparePassword(req.body.oldpassword);

    if(!isMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newpassword != req.body.confirmpassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password=req.body.newpassword;
    await user.save();

    sendToken(user,200,res);

});

//update user profile
exports.updateProfile=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    //update avtar:todo

    const user = await uuser.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
    });

});

//get all users (admin)
exports.getallUsers=catchAsyncError(async(req,res,next)=>{

    const users=await uuser.find();

    res.status(200).json({
        success:true,
        users
    });

});


//get single user (admin)
exports.getsingleUsers=catchAsyncError(async(req,res,next)=>{

    const user=await uuser.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does exist with id: ${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        user
    });

});

//update user role(admin)
exports.updateUserRole=catchAsyncError(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    //update avtar:todo

    const user = await uuser.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
    });

});

//delete user (admin)
exports.deleteUser=catchAsyncError(async(req,res,next)=>{

    const user=await uuser.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does exist with id: ${req.params.id}`,404));
    }

    //remove avtar:todo

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    });

});

