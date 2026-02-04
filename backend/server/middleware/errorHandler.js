// backend/middleware/errorHandler.js

export function errorHandler(err, req, res, next) {
  console.error("❌ Server Error:", err.stack || err.message || err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
}
