const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registercaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
} = require("../controllers/captain.controller");
const authMiddleware = require("../middlewares/auth.middleware");
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstName")
      .isLength({ min: 3 })
      .withMessage("First name should be greater than 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be greater than 6 characters"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("vehicle color must be greater than 3 characters"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("vehicle plate must be greater than 3 characters"),
    body("vehicle.capacity")
      .isLength({ min: 1 })
      .withMessage("vehicle capacity must be greater than 1 characters"),
    body("vehicle.vehicleType")
      .isIn(["car", "auto", "motorcycle"])
      .withMessage(" Invalid vehicle type"),
  ],
  registercaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginCaptain
);

router.get("/profile", authMiddleware.authCaptain, getCaptainProfile);

router.get("/logout", authMiddleware.authCaptain, logoutCaptain);
module.exports = router;
