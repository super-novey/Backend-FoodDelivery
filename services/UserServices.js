const User = require("../models/User");
const isUserExists = async (email, role) => {
  const userExists = await User.findOne({
    email: email,
    role: role,
    isDeleted: false,
  });
  return userExists;
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
const findUsersByStatus = async (status, isDeleted) => {
  return await User.find({ status, isDeleted });
};

const findUsersByRoleAndStatus = async (role, status) => {
  const query = { status };

  if (role && (role === 'driver' || role === 'partner')) {
    query.role = role;
  } else if (!role) {
    query.role = { $in: ['driver', 'partner'] };
  }

  return await User.find(query);
};

const updateUserById = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

const approveUserById = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { status: true },
    { new: true }
  );
};
const deleteUser = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );
};
const deleteApprove = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw new Error("Có lỗi xảy ra khi xóa người dùng");
  }
};
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return null; 
    }
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Error fetching user by ID");
  }
};


module.exports = { isUserExists, createUser, findUsersByStatus,
  findUsersByRoleAndStatus,
  updateUserById,
  approveUserById, 
  deleteUser,
  deleteApprove,
  getUserById
};
