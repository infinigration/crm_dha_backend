import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  createContract,
  getAllContracts,
} from "../controllers/contractsController.js";

const router = express.Router();
router.post(
  "/create_contract",
  isAuthenticated,
  authorizeAdmin,
  createContract
);

router.get("/contracts", isAuthenticated, getAllContracts);
router.get("/contract/:id", isAuthenticated, getAllContracts);
export default router;
