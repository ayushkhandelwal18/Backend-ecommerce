const pproduct=require("../models/productModels.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError=require("../middleware/catchasyncError.js")
const APIFeatures=require("../utils/apiFeatures.js");


//create product --> only admin can access
exports.createProduct=catchAsyncError(async(req,res,next)=>{

  req.body.user=req.user.id;

    const product=await pproduct.create(req.body);

    res.status(201).json({
        success:true,
        product
 });
});


//update product-->admin
exports.updateProduct=catchAsyncError(async(req,res,next)=>{

let upproduct = await pproduct.findById(req.params.id);
if(!upproduct) {
  return next(new ErrorHandler("Product not found",404))
}

upproduct=await pproduct.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
    success:true,
    upproduct
  });
});


//get all products
exports.getAllproducts=catchAsyncError(async(req,res)=>{

   const productperpage=5;
   const productcount=await pproduct.countDocuments();

 const features = new APIFeatures(pproduct.find(),req.query)
 .search().filter().pagination(productperpage);
  const allproducts=await features.query;
  res.status(200).json({
    success:true,
    allproducts,
    productcount
  });
});     

//get product details
exports.getProductDetails=catchAsyncError(async(req,res,next)=>{

  
  const getproduct = await pproduct.findById(req.params.id);

  if(!getproduct) {
    return next(new ErrorHandler("Product not found",404))
  }

  res.status(200).json({
    success:true,
    getproduct
  });
});      


//delete the product->admin
exports.deleteProduct=catchAsyncError(async(req,res,next)=>{

  const delproduct = await pproduct.findById(req.params.id);
if(!delproduct) {
  return next(new ErrorHandler("Product not found",404))
}

await delproduct.deleteOne();

res.status(200).json({
  success:true,
  message:"Product deleted successfully"
});
});

//create new review or update the review
exports.createProductReview=catchAsyncError(async(req,res,next)=>{

  const {rating, comment, productId}=req.body;

  const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  };

  const product=await pproduct.findById(productId);

  const isReviewed=product.reviews.find(
    rev=>rev.user.toString()===req.user._id.toString()
  );

  if(isReviewed){
    product.reviews.forEach((rev)=>{
      if(rev.user.toString()===req.user._id.toString()){
        rev.comment=comment;
        rev.rating=rating;
      }
    });
  }else{
    product.reviews.push(review);
    product.numOfReviews=product.reviews.length;
  }



  let avg=0;
  product.reviews.forEach((rev)=>{
    avg+=rev.rating
  }) 

  product.ratings=avg
  / product.reviews.length;

  await product.save({validateBeforeSave:false});

  res.status(200).json({
    success:true
  });


});

//get all reviews of a product
exports.getProductReviews=catchAsyncError(async(req,res,next)=>{

  const product=await pproduct.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews
  });
});

//delete review
exports.deleteReview=catchAsyncError(async(req,res,next)=>{

  const product=await pproduct.findById(req.query.id);

  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }

  const reviews=product.reviews.filter(
    rev=>rev._id.toString()!==req.query.reviewId);

  let avg=0;
  reviews.forEach((rev)=>{
    avg+=rev.rating
  }) 

const ratings=avg / reviews.length;

const numOfReviews=reviews.length;

await pproduct.findByIdAndUpdate(req.query.id,
  {reviews,ratings,numOfReviews},
{new:true,
  runValidators:true,  
  useFindAndModify:false});


  res.status(200).json({
    success:true,
  });
});