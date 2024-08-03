import express from "express";
import {getAllVendorPayments, 
  createVendor,
  getAllVendors,
  getVendor,
} from "../controllers/vendorController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.post("/create-vendor", isAuthenticated, createVendor);
router.get("/vendors", isAuthenticated, getAllVendors);
router.get("/vendor/:id", isAuthenticated, getVendor);
router.get("/vendor-payments", isAuthenticated, getAllVendorPayments);
export default router;
