const { validationResult } = require("express-validator");
const { createCaptain } = require("../services/captain.service");
const captainModel = require("../models/captain.model");
const bcrypt = require("bcrypt");
const blackListTokenModel = require("../models/blacklistToken.model");

const registercaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const iscaptainalreadyexist = await captainModel.findOne({
      email: req.body.email,
    });
    if (iscaptainalreadyexist) {
      return res.status(400).json({
        message: "Captain already exist with this email",
      });
    }
    const { fullname, password, email, vehicle } = req.body;
    const { color, plate, capacity, vehicleType } = vehicle;
    const hashedpassword = await bcrypt.hash(password, 10);

    const captain = await createCaptain({
      firstName: fullname.firstName,
      lastName: fullname.lastName,
      password: hashedpassword,
      email,
      color,
      plate,
      capacity,
      vehicleType,
    });

    const token = captain.generateAuthToken();
    res.status(201).json({ captain, token });
  } catch (e) {
    next(e); // Pass error to the error-handling middleware
  }
};

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, captain.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};

module.exports = {
  registercaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
};
