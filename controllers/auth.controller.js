import userModel from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { validateEmail } from "../validators/emailValidator.js";
import { generateVerificationCode } from "../utils/verificationToken.js";
import validator from "validator";
import { validateUserRole } from "../validators/userRoleValidator.js";
import { sendVerificationEmail } from "../resendMail/emailService.js";

export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
   if (!email || !fullName || !password || !role) {
  return res.status(400).json({ message: "All fields are required" });
}

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    validateEmail(email);
    const santizedEmail = validator.normalizeEmail(email);

    validateUserRole(role);

    const ExistedUser = await userModel.findOne({ email: santizedEmail }).lean(); //lean() is used to convert the Mongoose document into a plain JavaScript object,
    //  which is useful for performance reasons when you don't need the full Mongoose document functionality.
    if (ExistedUser)
      return res.status(400).json({ message: "User already exists" });

    const verificationCode = generateVerificationCode();

    const user = await userModel.create({
      fullName,
      email,
      password,
      role,
      verificationCode: verificationCode,
      verificationCodeExpiresAt: Date.now() + 60 * 60 * 1000,
    });
    // Send verification email
    await sendVerificationEmail(user.email, verificationCode);

    res.status(201).json({
      sucess: true,
      message: "User Created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const {token} = req.params;
try {
  const user = await userModel.findOne({verificationCode: token});

  if (!user) {
    return res.status(400).json({message: "Invalid or Expired verification code"})
  }

  if(user.verificationCodeExpiresAt < Date.now()){
    return res.status(400).json({message: "Verification Code has Expired"})
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;

  await user.save();

  return res.status(200).json({message: "Email verified Successfully"})
} catch (error) {
  return res.status(500).json({message: "Server Error", error: error.message})
}
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    if(!user.isVerified){
      return res.status(401).json({message: "Please Verify your Email First"})
    }

    res.json({
      id: user._id,
      FullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(501).json({ message: "Login Failed", error: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

