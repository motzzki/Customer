import express from "express";
import {
  register,
  login,
  changePassword,
  registerSubUser,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", verifyToken, changePassword);
router.post("/new-user", verifyToken, registerSubUser); 

export default router;
