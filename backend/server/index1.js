import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai_route.js";
import translateRoutes from "./routes/translate_route.js";
import historyRoutes from "./routes/history_route.js";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/techkhit";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ----------------------
// CORS Setup
// ----------------------
app.use(cors({
  origin: function(origin, callback) {
    console.log("Incoming request from origin:", origin); // debug log

    // allow server-side tools like Postman (no origin)
    if(!origin) return callback(null, true);

    // allow localhost
    if(origin === "http://localhost:3000") return callback(null, true);

    // allow any ngrok-free.dev URL automatically
    if(/^https:\/\/.+\.ngrok-free\.dev$/.test(origin)) return callback(null, true);

    // otherwise block
    callback(new Error("CORS policy: Origin not allowed"), false);
  },
  methods: ["GET","POST"],
  credentials: true
}));

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

// ----------------------
// Start server
// ----------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
