import express from "express";
import {
  addFollowUpDate,
  getTasksSummary,
} from "../controllers/taskController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/lead/:id/tasks", isAuthenticated, getTasksSummary);
router.put("/lead/addfollowupdate", isAuthenticated, addFollowUpDate);

export default router;
