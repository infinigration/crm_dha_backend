import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllClients } from "../controllers/clientController.js";

const router = express.Router();

router.get("/clients", isAuthenticated, getAllClients);

export default router;
