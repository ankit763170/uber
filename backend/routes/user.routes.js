const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getuserProfile,
  logoutUser,
} = require("../controllers/user.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const { route } = require("../app");
// Register Route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name should be greater than 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be greater than 6 characters"),
  ],
  registerUser
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],

  loginUser
);

router.get("/profile", authMiddleware.authUser, getuserProfile);
router.post("/logout", logoutUser);
module.exports = router;
