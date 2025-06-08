import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const register = (req, res) => {
  const { name, email, password, role, umkm_id } = req.body; // ✅ tambahkan umkm_id
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role, umkm_id) VALUES (?, ?, ?, ?, ?)",
    [name, email, hashedPassword, role, umkm_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "User berhasil terdaftar" });
    }
  );
};

// LOGIN USER
export const login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    if (data.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const isPasswordValid = bcrypt.compareSync(password, data[0].password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      {
        id: data[0].id,
        role: data[0].role,
        umkm_id: data[0].umkm_id, // ✅ sertakan umkm_id di token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: data[0].id,
        name: data[0].name,
        role: data[0].role,
        umkm_id: data[0].umkm_id, 
      },
    });
  });
};
