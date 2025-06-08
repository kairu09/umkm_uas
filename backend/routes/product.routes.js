import express from "express";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", verifyToken, getProducts);
router.post("/", verifyToken, addProduct);

export default router;
