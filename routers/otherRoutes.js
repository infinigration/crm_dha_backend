import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getDashboardStats } from "../controllers/otherControllers.js";

const router = express.Router();

router.get("/dashboard-stats", isAuthenticated, getDashboardStats);

export default router;
