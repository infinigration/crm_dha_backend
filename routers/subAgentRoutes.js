import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createSubAgent,
  getAllSubAgents,
} from "../controllers/subAgentController.js";

const router = express.Router();
router.get("/subagents", isAuthenticated, getAllSubAgents);
router.post("/create_subagent", isAuthenticated, createSubAgent);
export default router;
