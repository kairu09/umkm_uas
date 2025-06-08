import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role, umkm_id FROM users", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};

export const updateUser = (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;

  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    db.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, hashed, id],
      (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Kasir berhasil diupdate" });
      }
    );
  } else {
    db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id],
      (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Kasir berhasil diupdate" });
      }
    );
  }
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Kasir berhasil dihapus" });
  });
};
