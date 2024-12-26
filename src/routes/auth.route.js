const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", updateProfile);
router.put("/forgot-password", protectRoute, forgotPassword);

module.exports = router;
