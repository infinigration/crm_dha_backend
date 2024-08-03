import express from "express";
import { createProcess, getProcess } from "../controllers/processController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/create_process", isAuthenticated, authorizeAdmin, createProcess);
router.get("/process", isAuthenticated, authorizeAdmin, getProcess);
export default router;
