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

   console.log(`Verify user at: /api/auth/verify-email/${user.verificationCode}`);
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

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await userModel.findOne({ email }).select("+password");
//     if (!user || !token || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: "Invalid Credentials" });
//     }

//     res.json({
//       id: user._id,
//       FullName: user.fullName,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } catch (err) {
//     res.status(501).json({ message: "Login Failed", error: err.message });
//   }
// };
