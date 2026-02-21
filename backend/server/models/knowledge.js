import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  chapter: { type: String, default: "" },
  title: { type: String, default: "" },
  text: { type: String, default: "" },
  fileName: { type: String, default: "" },
  fileText: { type: String, default: "" },
  sourceType: { type: String, enum: ["text", "pdf", "mixed"], default: "text" },
  createdBy: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Knowledge = mongoose.model("Knowledge", knowledgeSchema);
export default Knowledge;
