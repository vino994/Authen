import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: ["https://j-movies-app.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));




app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://j-movies-app.netlify.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => res.send("Password Reset API Working"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
