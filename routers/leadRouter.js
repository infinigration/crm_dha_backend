import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import {
  assignLead,
  createLead,
  forwardLead,
  getAllLeads,
  getLeadDetails,
  getMyLeads,
  updateClientDetails,
  updateClientProfile,
  updateStatus,
  uploadClientDocuments,
  uploadClientPorfile,
} from "../controllers/leadController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();
router.get("/leads", isAuthenticated, getAllLeads);
router.post("/createlead", isAuthenticated, createLead);
router.put("/updateleadstatus", isAuthenticated, authorizeAdmin, updateStatus);
router.get("/lead/:id", isAuthenticated, authorizeAdmin, getLeadDetails);
router.put(
  "/lead/client/:id",
  isAuthenticated,
  authorizeAdmin,
  updateClientDetails
);
router.post("/forwardlead", isAuthenticated, forwardLead);
router.post("/assignlead", isAuthenticated, assignLead);
router.post(
  "/uploadclientavatar/:id",
  isAuthenticated,
  singleUpload,
  uploadClientPorfile
);

router.put("/updateclientprofile/:id", isAuthenticated, updateClientProfile);

router.put(
  "/uploadclientdocument/:lId/:dId",
  isAuthenticated,
  singleUpload,
  uploadClientDocuments
);

router.get("/my_leads", isAuthenticated, getMyLeads);
export default router;
