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
  origin: [
    "http://localhost:5173",
    "http://localhost:5000",
    "https://j-movies-app.netlify.app",
    "https://authen-eytd.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Test routes
app.get("/", (req, res) => res.send("Password Reset API Working"));

app.get("/mail-test", async (req, res) => {
  try {
    await sendEmail(
      "vinodjayasudha@gmail.com",
      "Test Mail",
      "<h1>Mail working macha!</h1>"
    );

    res.send("Mail sent!");
  } catch (err) {
    res.status(500).send("Mail error: " + err.message);
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));
