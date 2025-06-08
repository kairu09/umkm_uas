import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import reportRoutes from "./routes/report.routes.js";
import userRoutes from "./routes/user.routes.js";
import umkmRoutes from "./routes/umkm.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/users", userRoutes);

app.use("/api/umkm", umkmRoutes);

app.get("/", (req, res) => {
  res.send("Backend UMKM API Aktif 🔥");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
