const express=require("express");
const router=express.Router();

const { isAuthenticatedUser , authorizedRoles} = require("../middleware/auth");

const {newOrder,getSingleOrder,myOrders,allOrders,updateOrderStatus,deleteOrder}=require("../controller/orderController");


router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("admin"),allOrders);
router.route("/admin/orders/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateOrderStatus);
router.route("/orders/me").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteOrder);

module.exports=router;