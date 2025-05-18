import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
    isVerified: {
      type:Boolean,
      default: false
    },
     verificationCode: String,
    verificationCodeExpiresAt: Date,
    resetPasswordCode: String,
    resetPasswordCodeExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}); // It is used to hash the password before saving it to the database.The `pre` middleware runs before the `save` operation.
// If the password is modified, it generates a salt and hashes the password using bcrypt.

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}; //It is used to compare the password entered by the user with the hashed password stored in the database.

export default mongoose.model("User", userSchema);
