import db from "../config/db.js";

export const createUmkm = (req, res) => {
  const { name, alamat, pemilik } = req.body;
  db.query(
    "INSERT INTO umkm (name, alamat, pemilik) VALUES (?, ?, ?)",
    [name, alamat, pemilik],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
};

export const getAllUmkm = (req, res) => {
  db.query("SELECT * FROM umkm", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
