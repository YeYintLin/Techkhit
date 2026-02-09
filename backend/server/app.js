import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai_route.js";
import translateRoutes from "./routes/translate_route.js";
import historyRoutes from "./routes/history_route.js";
import mongoose from "mongoose";

const app = express();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/techkhit";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ----------------------
// CORS Setup
// ----------------------
const allowedOrigins = new Set([
  "http://localhost:3000",
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map(o => o.trim()).filter(Boolean)
    : [])
]);

function isOriginAllowed(origin) {
  if (!origin) return true; // allow server-side tools (no origin)
  if (allowedOrigins.has(origin)) return true;
  if (/^https:\/\/.+\.ngrok-free\.dev$/.test(origin)) return true;
  if (/^https:\/\/.+\.vercel\.app$/.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming request from origin:", origin); // debug log

      if (isOriginAllowed(origin)) return callback(null, true);

      callback(new Error("CORS policy: Origin not allowed"), false);
    },
    methods: ["GET", "POST"],
    credentials: true
  })
);

// ----------------------
// Middlewares
// ----------------------
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ----------------------
// API Routes
// ----------------------
app.use("/api/chat", aiRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/history", historyRoutes);

export default app;
