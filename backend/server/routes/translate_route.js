// backend/routes/translate.route.js
import express from "express";
import { translateController } from "../controllers/translate_controller.js";

const router = express.Router();

// POST /translate
router.post("/", translateController);

export default router;
