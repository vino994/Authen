import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },

  resetToken: { type: String },
  resetTokenExpire: { type: Date }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
