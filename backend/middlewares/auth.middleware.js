const BlacklistToken = require("../models/blacklistToken.model");
const UserModel = require("../models/user-model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return next(new Error("No token provided. Authorization denied."));
    }
    const isBlacklisted = BlacklistToken.findOne({ token: token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return next(new Error("User  not found. Authorization denied."));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token. Authorization denied."));
  }
};
