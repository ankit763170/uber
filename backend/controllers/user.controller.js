const express = require("express");
const UserModel = require("../models/user-model");
const userservice = require("../services/user.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extract data from request body
    const { fullname, email, password } = req.body;

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
module.exports = { registerUser };
