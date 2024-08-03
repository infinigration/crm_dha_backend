import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createInvoice, getAllInvoices } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/create_invoice/:id", isAuthenticated, createInvoice);
router.get("/invoices", isAuthenticated, getAllInvoices);

export default router;
