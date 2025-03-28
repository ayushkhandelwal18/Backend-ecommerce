const mongoose =require ('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto= require('crypto');
const { create } = require('./productModels');

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, 'Please enter your name'],
        minLength: [3, 'Your name must be at least 4 characters'],
        },

    email:{
        type:String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate:[validator.isEmail, 'Please enter a valid email address']
},

    password:{
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Your password must be at least 6 characters'],
        select: false
    },

    avtar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },

    role:{
        type: String,
        default: 'user'
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});


//jwt token
userSchema.methods.getJWTToken =function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};


//password copare krenge yha pe

userSchema.methods.comparePassword =async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
    };

// generating password reset token
userSchema.methods.getResetPasswordToken=function(){

    //generating the token
    const resetToken= crypto.randomBytes(20).toString('hex');

    //hashing and adding resetPasswordToken to userschema
    this.resetPasswordToken=crypto
    .createHash("sha256")
    .update(resetToken)
    .digest('hex');

    this.resetPasswordExpire=Date.now() + 15*60*1000; //15 minutes
   
    return resetToken;
};


module.exports = mongoose.model('User', userSchema);