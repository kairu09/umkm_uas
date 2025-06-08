import express from "express";
import { getDailyReport, getMonthlyReport } from "../controllers/report.controller.js";
const router = express.Router();

router.get("/daily", getDailyReport);
router.get("/monthly", getMonthlyReport);

export default router;
