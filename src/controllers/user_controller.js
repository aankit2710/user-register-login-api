const express = require("express");
const router = express.Router();
const {
    Register,
    Signin
} = require("../Service/user");

// To register User
router.post("/register", Register);

// To signIn
router.post("/login", Signin);

module.exports = router;