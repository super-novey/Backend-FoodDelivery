const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");

/**
 * @desc Register new user
 * @route POST /api/v1/auth/register
 * @access public
 */
const register = AsyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // is user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(
      "User with provided Email address already exists",
      StatusCodes.CONFLICT
    );
  }

  // Hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
    phone: phone,
  });

  if (!user) {
    throw new ApiError(
      "Internal Server Error! Server failed creating new user."
    );
  }

  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse(
        "User registered successfully.",
        { user },
        StatusCodes.CREATED
      )
    );
});

/**
 * @desc authenticate user (login)
 * @route POST /api/v1/auth/login
 * @access public
 */
const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check for user email
  const user = await User.findOne({ email });
  const authenticate =
    user && (await bcrypt.compare(password, user.hashedPassword));

  if (!authenticate) {
    throw new ApiError("Invalid credentials!", StatusCodes.UNAUTHORIZED, {
      credentials: { email, password },
    });
  }

  const responseData = {
    user,
    token: generateToken(user._id),
  };

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("User logged in successfully.", responseData));
});

/**
 * @desc get currently authenticated user (login)
 * @route GET /api/v1/auth/me
 * @access private
 */
const getCurrentUser = AsyncHandler(async (req, res) => {
  const responseData = req.user;

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Current user data.", { user: responseData }));
});

/**
 * @desc generate JWT
 */
const generateToken = (id) => {
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign({ id }, process.env.JWT_SECRET, options);
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
