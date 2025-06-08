import express from "express";
import { createUmkm, getAllUmkm } from "../controllers/umkm.controller.js";
const router = express.Router();

router.post("/", createUmkm);
router.get("/", getAllUmkm);

export default router;
