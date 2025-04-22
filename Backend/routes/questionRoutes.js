import express from "express";

import { getQuestion } from "../controller/questionController.js";

const router = express.Router();

router.get("/get-questions", getQuestion);

export default router;
