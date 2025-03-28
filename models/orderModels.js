const mongoose = require('mongoose');
const { toDate } = require('validator');
const { default: isTaxID } = require('validator/lib/isTaxID');
const { create } = require('./productModels');

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        sate:{
            type: String,
            required: true
        },
        country:{
            default: 'India',
            type: String,
            required: true
        },
        pinCode:{
            type: Number,
            required: true
        },
        phoneNo:{
            type: Number,
            required: true
        },
    },

    orderItems:[
        {
            name:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            image:{
                type: Number,
                required: true
            },
            product:{
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],


 user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },

    paymentInfo:{
        id:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        }
    },

    paidAt:{
        type: Date,
        required: true
    },

    itemsPrice:{
        type: Number,
        required: true,
        default: 0.0
    },

    taxPrice:{
        type: Number,
        required: true,
        default: 0.0
    },

    shippingPrice:{
        type: Number,
        required: true,
        default: 0.0
    },

    totalPrice:{
        type: Number,
        required: true,
        default: 0.0
    },


    orderStatus:{
        type: String,
        required: true,
        default: 'Processing'
    },

    deliveredAt: Date,

    createdAt:{
        type:Date,
        default:Date.now
    }
    
});

module.exports = mongoose.model('Order', orderSchema);