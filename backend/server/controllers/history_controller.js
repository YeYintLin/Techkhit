// import SearchHistory from "../models/searchHistory.js";

// // Save a search query
// export const addSearchHistory = async (req, res) => {
//   try {
//     const { userId, query } = req.body;
//     if (!userId || !query) return res.status(400).json({ message: "Missing userId or query" });

//     const history = new SearchHistory({ userId, query });
//     await history.save();

//     res.status(201).json({ message: "Search saved successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get recent search history
// export const getSearchHistory = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const history = await SearchHistory.find({ userId })
//       .sort({ timestamp: -1 }) // latest first
//       .limit(20);              // show last 20 searches

//     res.json(history);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
