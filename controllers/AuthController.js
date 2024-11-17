const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");

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

  // Generate OTP
  const { otp, otpExpires } = generateOtp();

  // create user
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
    phone: phone,
    otp: otp,
    otpExpires: otpExpires,
  });

  // send OTP via email
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực OTP",
      text: `Mã OTP của bạn là: ${otp}`,
    },
    (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );

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
  const authenticate = user && (await bcrypt.compare(password, user.password));

  if (!authenticate) {
    throw new ApiError("Invalid credentials!", StatusCodes.UNAUTHORIZED, {
      credentials: { email, password },
    });
  }
  if (user.otp !== null || user.otpExpires !== null) {
    throw new ApiError("User is unauthorized!", StatusCodes.UNAUTHORIZED);
  }

  const responseData = {
    user,
    token: generateToken(user._id),
  };

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("User logged in successfully.", responseData));
});

const resendOTP = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  // is user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw new ApiError("User not found!", StatusCodes.CONFLICT);
  }

  // Generate OTP
  const { otp, otpExpires } = generateOtp();

  userExists.otp = otp;
  userExists.otpExpires = otpExpires;

  await userExists.save();

  // send OTP via email
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực OTP",
      text: `Mã OTP của bạn là: ${otp}`,
    },
    (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );

  res.status(StatusCodes.OK).json(ApiResponse("OTP resend successfully"));
});

const verifyOtp = AsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const userExists = await User.findOne({ email });
  if (!userExists)
    throw new ApiError("User not found!", StatusCodes.UNAUTHORIZED);

  if (userExists.otp !== otp) throw new ApiError("Invalid OTP");

  if (new Date() > new Date(userExists.otpExpires))
    throw new ApiError("OTP expired");

  userExists.otp = null;
  userExists.otpExpires = null;

  await userExists.save();

  res.status(StatusCodes.OK).json(ApiResponse("OTP verified successfully"));
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

const generateOtp = () => {
  const otp = crypto.randomInt(1000, 9999).toString(); // Random 6-digit OTP
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
  return { otp, otpExpires };
};

module.exports = generateOtp;

module.exports = {
  register,
  login,
  getCurrentUser,
  verifyOtp,
  resendOTP,
};
