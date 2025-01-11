const express = require("express");
const UserModel = require("../models/user-model");
const userservice = require("../services/user.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const blacklistTokenSchema = require("../models/blacklistToken.model");

const registerUser = async (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract data from request body
    const { fullname, email, password } = req.body;
    const isuserexist = await UserModel.findOne({
      email: req.body.email,
    });
    if (isuserexist) {
      return res.status(400).json({
        message: "user already exist with this email",
      });
    }
    // Hash the password
    const hashedpassword = await bcrypt.hash(password, 10);

    // Register the user using the service layer
    const user = await userservice.createUser({
      firstName: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedpassword,
    });

    // Generate authentication token (ensure this method exists in your UserModel)
    const token = user.generateAuthToken();

    // Send success response
    res.status(201).json({
      message: "User  registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Error in registerUser :", error);

    // Send error response
    res.status(500).json({
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error in loginuser :", error);
  }
};

const getuserProfile = async (req, res, next) => {
  return res.status(201).json(req.user);
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    const token = req.cookies.token || req.header.authorization.split(" ")[1];
    await blacklistTokenSchema.create({
      token,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logoutUser :", error);
    return res
      .status(500)
      .json({ message: "An error occurred while logging out" });
  }
};

module.exports = { registerUser, loginUser, getuserProfile, logoutUser };
