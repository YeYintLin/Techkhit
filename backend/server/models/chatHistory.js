import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema({
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "ai"], required: true },
      text: { type: String, required: true },
      videos: { type: Array, default: [] },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);
export default ChatHistory;
