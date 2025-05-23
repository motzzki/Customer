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
  // getFeedBackData,
  getCustomerStats,
  getSurveyResults,
  getCustomerStatsMonth,
  getSurveyResultsMonth,
} from "../controller/divisionController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add-division", verifyToken, addDivision);
router.put("/updateDivision", verifyToken, updateDivision);
router.get("/get-divisions", getDivisions);
router.get("/get-services", getServices);
router.get("/get-sub-division", getSubDivision);
router.get("/get-feedback/:division_id", getFeedbackByDivision);
router.get(
  "/services-and-subdivisions/:division_id",
  getServicesAndSubdivisions
);

// router.get("/feedback-data", getFeedBackData);
router.post("/insert-feedback", insertFeedback);
router.get("/customer-stats", getCustomerStats);
router.get("/survey-results", getSurveyResults);
router.get("/customer-stats-month", getCustomerStatsMonth);
router.get("/survey-results-month", getSurveyResultsMonth);

export default router;
