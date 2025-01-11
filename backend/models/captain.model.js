const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const captainSchema = new mongoose.Schema({
  fullname: {
    firstName: {
      type: String,
      required: true,
      minLength: [
        3,
        "Please re-enter first name, which should be more than 3 characters",
      ],
    },
    lastName: {
      type: String,
      minLength: [
        3,
        "Please re-enter last name, which should be more than 3 characters",
      ],
    },
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    minLength: [
      5,
      "Please re-enter email, which should be more than 5 characters",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    color: {
      type: String,
      required: true,
    },
    plate: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "auto", "motorcycle"],
      required: true,
    },
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});
captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(this.password, password);
};

captainSchema.methods.hashPassword = async function () {
  return await bcrypt.hash(password, 10);
};
const captainSchemaModel = mongoose.model("captain", captainSchema);
module.exports = captainSchemaModel;
