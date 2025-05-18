import validator from "validator";

export const verificationTokenValidator = (code) => {
  if (
    !code ||
    typeof code !== "string" ||
    validator.isNumeric(code) ||
    code.length !== 6
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code Format",
    });
  }
};
