import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { createPayroll, getAllPayrolls } from "../controllers/payrollController.js";

const router = express.Router();

router.post("/create-payroll", isAuthenticated, authorizeAdmin, createPayroll);
router.get("/payrolls", isAuthenticated, authorizeAdmin, getAllPayrolls);

export default router;
