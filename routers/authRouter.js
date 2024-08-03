import express from "express";
import {
  changePassword,
  createUser,
  getAllEmployees,
  getEmployeeProfile,
  getMyProfile,
  login,
  logout,
  updateProfile,
} from "../controllers/authController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/createuser", createUser);
router.get("/logout", logout);
router.get("/me", isAuthenticated, getMyProfile);

// Admin Routes
router.get("/employees", isAuthenticated, getAllEmployees);
router.get("/profile/:id", isAuthenticated, authorizeAdmin, getEmployeeProfile);
router.post(
  "/changepassword/:id",
  isAuthenticated,
  authorizeAdmin,
  changePassword
);
router.put(
  "/updateprofile/:id",
  isAuthenticated,
  authorizeAdmin,
  updateProfile
);

export default router;
