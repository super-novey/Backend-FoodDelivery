const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");

const AsyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const UpdatedDriver = require("..//models/UpdatedDriver");
const ApiError = require("./error/ApiError");
const ApiResponse = require("./response/ApiResponse");

// Services
const { isUserExists, createUser } = require("../services/UserServices");
const { createDriver } = require("../services/DriverServices");

const { createPartner } = require("../services/PartnerServices");
const {
  returnSingleFilePath,
  singleFileTransfer,
} = require("../helpers/fileHelpers");

/**
 * @desc Register new user
 * @route POST /api/v1/auth/register
 * @access public
 */
const register = AsyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // is user exists
  const userExists = await isUserExists(email, role);

  if (userExists) {
    throw new ApiError(
      "User with provided Email address already exists",
      StatusCodes.CONFLICT
    );
  }
  // if (userExists) {
  //   return res
  //     .status(StatusCodes.CONFLICT)
  //     .json(
  //       ApiResponse(
  //         "User with provided Email address already exists",
  //         null,
  //         StatusCodes.CONFLICT,
  //         true
  //       )
  //     );
  // }
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
    status: true,
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

const driverRegister = AsyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    licensePlate,
    provinceId,
    districtId,
    communeId,
    detailAddress,
  } = req.body;

  const role = "driver";
  const userExists = await isUserExists(email, role);

  if (userExists)
    return res
      .status(StatusCodes.CONFLICT)
      .json(
        ApiResponse(
          "User with provided Email address already exists",
          null,
          StatusCodes.CONFLICT,
          true
        )
      );

  // Hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP
  const { otp, otpExpires } = generateOtp();

  const user = await createUser(
    name,
    email,
    hashedPassword,
    role,
    phone,
    otp,
    otpExpires
  );

  if (!user) {
    throw new ApiError(
      "Internal Server Error! Server failed creating new user."
    );
  }

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

  let profileUrl = "";
  let licenseFrontUrl = "";
  let licenseBackUrl = "";

  if (req.files) {
    profileUrl = req.files.profileUrl[0].path;
    licenseFrontUrl = req.files.licenseFrontUrl[0].path;
    licenseBackUrl = req.files.licenseBackUrl[0].path;
  }

  const newDriver = await createDriver(
    user._id,
    licensePlate,
    licenseFrontUrl,
    licenseBackUrl,
    profileUrl,
    provinceId,
    districtId,
    communeId,
    detailAddress
  );

  // const data = await getDriverWithUserDetails(newDriver._id);

  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse(
        "Driver registered successfully.",
        newDriver,
        StatusCodes.CREATED
      )
    );
});

const partnerRegister = AsyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    provinceId,
    districtId,
    communeId,
    detailAddress,
    description,
  } = req.body;

  const role = "partner";
  const userExists = await isUserExists(email, role, false);

  if (userExists)
    return res
      .status(StatusCodes.CONFLICT)
      .json(
        ApiResponse(
          "User with provided Email address already exists",
          null,
          StatusCodes.CONFLICT,
          true
        )
      );

  // Hash password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP
  const { otp, otpExpires } = generateOtp();

  const user = await createUser(
    name,
    email,
    hashedPassword,
    role,
    phone,
    otp,
    otpExpires
  );

  if (!user) {
    throw new ApiError(
      "Internal Server Error! Server failed creating new user."
    );
  }

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

  let avatarUrl = "";
  let storeFront = "";
  let CCCDFrontUrl = "";
  let CCCDBackUrl = "";

  if (req.files) {
    avatarUrl = req.files.avatarUrl[0].path;
    storeFront = req.files.storeFront[0].path;
    CCCDFrontUrl = req.files.CCCDFrontUrl[0].path;
    CCCDBackUrl = req.files.CCCDBackUrl[0].path;
  }

  const newPartner = await createPartner(
    user._id,
    description,
    provinceId,
    districtId,
    communeId,
    detailAddress,
    avatarUrl,
    storeFront,
    CCCDFrontUrl,
    CCCDBackUrl
  );

  // const data = await getDriverWithUserDetails(newDriver._id);

  res
    .status(StatusCodes.CREATED)
    .json(
      ApiResponse(
        "Partner registered successfully.",
        newPartner,
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
  const { email, password, role } = req.body;

  // check for user email
  const user = await isUserExists(email, role);
  const authenticate = user && (await bcrypt.compare(password, user.password));

  if (!authenticate) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ApiResponse(
          "Tài khoản không tồn tại!",
          null,
          StatusCodes.UNAUTHORIZED,
          true
        )
      );
  }

  if (user.otp !== null || user.otpExpires !== null) {
    // throw new ApiError("User is unauthorized!", StatusCodes.UNAUTHORIZED);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ApiResponse(
          "Tài khoản chưa xác thực",
          null,
          StatusCodes.UNAUTHORIZED,
          true
        )
      );
  }

  if (!user.status || user.isDeleted) {
    // throw new ApiError("Pending...", StatusCodes.UNAUTHORIZED);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ApiResponse(
          "Hồ sơ đang chờ duyệt...",
          null,
          StatusCodes.UNAUTHORIZED,
          true
        )
      );
  }

  const responseData = {
    user,
    token: generateToken(user._id),
  };

  res
    .status(StatusCodes.OK)
    .json(ApiResponse("Đăng nhập thành công!", responseData));
});

const resendOTP = AsyncHandler(async (req, res) => {
  const { email, role } = req.body;

  // is user exists
  const userExists = await isUserExists(email, role);

  if (!userExists) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ApiResponse(
          "Địa chỉ email chưa được đăng ký!",
          null,
          StatusCodes.UNAUTHORIZED,
          true
        )
      );
  }

  if (userExists.otp == null || userExists.otpExpires == null)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        ApiResponse(
          "Tài khoản đã được xác thực!",
          null,
          StatusCodes.UNAUTHORIZED,
          true
        )
      );

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
  const { email, otp, role } = req.body;

  const userExists = await isUserExists(email, role);
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
  driverRegister,
  partnerRegister,
};
