const UserModel = require("../models/user-model");

module.exports.createUser = async ({
  firstName,
  lastname,
  email,
  password,
}) => {
  if (!firstName || !password) {
    throw new Error("Please fill in all fields");
  }

  const user = UserModel.create({
    fullname: {
      firstName,
      lastname,
    },
    email,
    password,
  });

  return user;
};
