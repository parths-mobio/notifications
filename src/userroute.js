var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const {  signin } = require("./usercontroller");
const { isSignedIn} = require("./usercontroller");

router.post(
    "/auth/signin",
    [
      check("email", "email is required").isEmail(),
      check("password", "password field is required").isLength({ min: 1 }),
    ],
    signin
  );


module.exports = router;