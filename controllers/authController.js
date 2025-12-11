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
   const lowerEmail = email.toLowerCase();
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

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
    const lowerEmail = email.toLowerCase();
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

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
// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const all = await User.find({});
console.log("All Users:", all);
    const lowerEmail = email.toLowerCase();
    if (!email) return res.status(400).json({ msg: "Email required" });

    try {
      await fetch(`${process.env.BACKEND_URL}/api/auth/test`);
    } catch (err) {
      console.log("Render wake-up skipped");
    }

    const user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + Number(process.env.RESET_TOKEN_EXPIRY || 600000);
    await user.save();

    const frontend = process.env.FRONTEND_URL.replace(/\/$/, "");
    const link = `${frontend}/reset-password/${token}`;

  const html = `
  <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif;">
    <tr>
      <td align="center">
        <table width="90%" cellspacing="0" cellpadding="0" style="max-width: 500px; background: #ffffff; padding: 20px; border-radius: 10px;">

          <tr>
            <td>
              <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
              <p style="color: #555;">
                You requested to reset your password. Click the button below:
              </p>
            </td>
          </tr>

          <!-- BUTTON SECTION - Always clickable -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="${link}"
                 style="
                   background-color: #4CAF50;
                   color: white;
                   padding: 12px 20px;
                   text-decoration: none;
                   border-radius: 5px;
                   font-size: 16px;
                   display: inline-block;
                 "
                 target="_blank">
                Reset Password
              </a>
            </td>
          </tr>

          <!-- FALLBACK LINK -->
          <tr>
            <td>
              <p style="color: #555;">If the button doesn't work, copy the link below:</p>
              <p style="word-break: break-all;">
                <a href="${link}" target="_blank">${link}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <p style="color: #888; font-size: 12px;">This link expires in 10 minutes.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
`;


    await sendEmail(user.email, "Password Reset", html);

    res.json({ msg: "Password reset link sent" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
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

// Test route (optional)
export const testRoute = (req, res) => res.send("Auth Route Working!");
