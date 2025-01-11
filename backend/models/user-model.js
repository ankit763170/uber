const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
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
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(this.password, password);
};

userSchema.statics.hashpassword = async function () {
  return await bcrypt.hash(password, 10);
};
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
