// controllers/authController.js
import User from "../models/user.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
// import OTP from "../models/otp.js";
import { saveOtp } from "../utils/otpStore.js";
import { verifyOtpStore } from "../utils/otpStore.js";
import { markVerified, isVerified } from "../utils/otpStore.js";
// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    email = email.toLowerCase();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
    if (!isVerified(email)) {
      return res.status(400).json({
        message: "Please verify OTP first"
      });
    }
    // 🔥 IMPORTANT: You should ONLY reach here AFTER OTP verified
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true
    });

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// LOGIN USER
export const loginUser = async (req, res) => {
  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    // 👉 If user exists → store in DB
    if (user) {
      user.otp = otp;
      user.otpExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
    }

    // 👉 If user DOES NOT exist → store in memory
    else {
      saveOtp(email, otp);   // 🔥 THIS IS WHERE IT GOES
    }

    await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);

    res.json({
      success: true,
      message: "OTP sent"
    });
    console.log("OTP SENT:", otp);

  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;

  email = email.toLowerCase();
  otp = String(otp);

  console.log("VERIFY EMAIL:", email);
  console.log("OTP ENTERED:", otp);

  let user = await User.findOne({ email });

  if (user) {
    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;   // 🔥 ADD THIS
    await user.save();
    return res.json({ success: true, message: "OTP verified" });
  }

  const isValid = verifyOtpStore(email, otp);

  if (!isValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  markVerified(email);
  res.json({ success: true, message: "OTP verified" });
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  await sendEmail(email, "Reset Password OTP", `OTP: ${otp}`);

  res.json({ success: true });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.password = newPassword;
  user.otp = null;
  user.otpExpire = null;

  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);