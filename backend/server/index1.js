import app from "./app.js";

const PORT = process.env.PORT || 5000;

// ----------------------
// Start server
// ----------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
