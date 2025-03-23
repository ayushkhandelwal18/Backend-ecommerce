const express=require("express");
const {getAllproducts,createProduct,updateProduct, deleteProduct, getProductDetails,createProductReview,getProductReviews} = require("../controller/productcontroller");
const { isAuthenticatedUser , authorizedRoles} = require("../middleware/auth");


const router=express.Router();


router.route("/prooducts").get(getAllproducts);
router.route("/admin/prooducts/new").post(isAuthenticatedUser, authorizedRoles("admin"),createProduct);
router.route("/admin/prooducts/:id").put(isAuthenticatedUser, authorizedRoles("admin"),updateProduct);
router.route("admin/prooducts/:id").delete(isAuthenticatedUser, authorizedRoles("admin"),deleteProduct);
router.route("/prooducts/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/reviews").get(getProductReviews).delete;


module.exports=router;