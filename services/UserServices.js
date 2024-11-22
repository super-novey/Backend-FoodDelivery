const User = require("../models/User");
const isUserExists = async (email, role, isDeleted) => {
  const userExists = await User.findOne({ email, role, isDeleted });

  return userExists !== null;
};

const createUser = async (
  name,
  email,
  hashedPassword,
  role,
  phone,
  otp,
  otpExpires
) => {
  return await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
    phone: phone,
    otp: otp,
    otpExpires: otpExpires,
  });
};
module.exports = { isUserExists, createUser };
