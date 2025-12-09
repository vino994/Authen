import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import sendEmail from "./utils/sendEmail.js";

dotenv.config();
const app = express();

// DB connect
connectDB();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Test routes
app.get("/", (req, res) => res.send("Password Reset API Working"));

app.get("/test-mail", async (req, res) => {
  try {
    await sendEmail(
      "vinodjayasudha@gmail.com",
      "Render Gmail SMTP Test",
      "<h1>Mail Working!</h1>"
    );
    res.send("Mail sent successfully!");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
