import express from "express";

import {
  addDivision,
  getDivisions,
  updateDivision,
  getFeedbackByDivision,
  getServices,
  getSubDivision,
  insertFeedback,
  getServicesAndSubdivisions,
  getFeedBackData,
  getQuestionnaire,
} from "../controller/divisionController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add-division", verifyToken, addDivision);
router.put("/updateDivision", verifyToken, updateDivision);
router.get("/get-divisions", verifyToken, getDivisions);
router.get("/get-services", verifyToken, getServices);
router.get("/get-sub-division", verifyToken, getSubDivision);
router.get("/get-feedback/:division_id", verifyToken, getFeedbackByDivision);
router.get(
  "/services-and-subdivisions/:division_id",
  verifyToken,
  getServicesAndSubdivisions
);

router.get("/feedback-data", verifyToken, getFeedBackData);
router.post("/insert-feedback", insertFeedback);
router.get("/get-questions", getQuestionnaire);

export default router;
