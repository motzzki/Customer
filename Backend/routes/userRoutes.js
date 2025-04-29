import express from "express";
import {
  register,
  login,
  changePassword,
  registerSubUser,
  getSubUsers,
  archiveUser,
  resetPassword,
  editUser,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);
router.post("/new-user", verifyToken, registerSubUser);
router.get("/get-user", verifyToken, getSubUsers);
router.put("/archive/:userId", verifyToken, archiveUser);
router.put("/reset-password/:userId", verifyToken, resetPassword);
router.put("/edit-user/:userId", verifyToken, editUser);

export default router;
