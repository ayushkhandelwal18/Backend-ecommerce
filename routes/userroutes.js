const express=require("express");

const{signup, signin, logout , forgotPassword,resetPassword,getUserProfile,updatePassword,updateProfile,getallUsers,getsingleUsers,updateUserRole,deleteUser}=require("../controller/userController.js");

const{isAuthenticatedUser, authorizedRoles }=require("../middleware/auth.js");
const router=express.Router();

router.route("/register").post(signup);

router.route("/login").post(signin);

router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser,getUserProfile);

router.route("/password/update").put(isAuthenticatedUser,updatePassword);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getallUsers);

router.route("/admin/users/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getsingleUsers);

router.route("/admin/users/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole);

router.route("/admin/users/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteUser);
module.exports=router;