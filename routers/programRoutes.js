import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createProgram,
  getAllPrograms,
  getProgram,
  updateProgram,
  updateProgramStatus,
} from "../controllers/programController.js";

const router = express.Router();
router.get("/programs", isAuthenticated, getAllPrograms);
router.post("/create-program", isAuthenticated, createProgram);
router.get("/program/:id", isAuthenticated, getProgram);
router.put("/program/:id", isAuthenticated, updateProgramStatus);
router.put("/updateprogram/:id", isAuthenticated, updateProgram);

export default router;
