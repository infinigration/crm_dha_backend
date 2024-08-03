import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createRemark } from "../controllers/remarksController.js";

const router = express.Router();
router.post("/create_remark/:id", isAuthenticated, createRemark)

export default router;
