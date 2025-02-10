const express = require("express");
const { 
   addUser,
   userLoginAuthentication,
   updateUserDetails,
} = require("../controllers/userController");

const router = express.Router();



router.post("/add-user", addUser);
router.post("/login", userLoginAuthentication);
router.put("/userupdate/:userId", updateUserDetails)

module.exports = router;
