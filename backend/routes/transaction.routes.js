import express from "express";
import { createTransaction, getTransactions } from "../controllers/transaction.controller.js";
const router = express.Router();
import { verifyToken } from "../middlewares/auth.js";

router.post("/", verifyToken, createTransaction);
router.get("/", verifyToken, getTransactions);

export default router;