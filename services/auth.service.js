const bcrypt = require("bcryptjs");

const UserServices = require('./UserServices');
const {Result, AppError} = require('../utils/result');
const {generateOtp} = require('../utils/otpGenerator');

class AuthService {
    async register(name, email, password, role, phone) {
        const userExists = await UserServices.isUserExists(email, role);
        if (userExists) {
            return Result.failure(new AppError('User already exists', 409));
        }

        //Hash password
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(password, salt);

        const { otp, otpExpires } = generateOtp();

        const user = await UserServices.createUser({
            name: name,
            email: email,
            password: password,
            status: true,
            role: role,
            phone: phone,
            otp: otp,
            otpExpires: otpExpires,
          });
        return Result.success({user, otp});
    }

    
}

module.exports = new AuthService();