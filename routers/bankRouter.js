import express from "express";
import { createBank, getAllBanks } from "../controllers/bankController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/create_bank", isAuthenticated, createBank);
router.get("/banks", isAuthenticated, getAllBanks);
export default router;
