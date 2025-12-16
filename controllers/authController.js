import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const makeToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    const lowerEmail = email.toLowerCase();
    const exists = await User.findOne({ email: lowerEmail });
    if (exists) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: lowerEmail, password: hashed });
    const token = makeToken(user._id);

    res.json({ msg: "Registered", token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    const token = makeToken(user._id);
    res.json({ msg: "Logged in", token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Save token and expiry (10 minutes)
    user.resetToken = token;
    user.resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Build reset link
    const frontendURL = process.env.FRONTEND_URL.replace(/\/$/, "");
    const resetLink = `${frontendURL}/reset-password/${token}`;

    const html = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link expires in 10 minutes.</p>
    `;

    // 🔐 IMPORTANT: Email should NOT break the API
    try {
      await sendEmail(user.email, "Password Reset", html);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
      // Do NOT throw error – continue response
    }

    // Always return success to client
    res.status(200).json({
      msg: "Password reset link generated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};


// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ msg: "Password required" });

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Test route
export const testRoute = (req, res) => res.send("Auth Route Working!");
