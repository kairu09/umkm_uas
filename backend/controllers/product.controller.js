import db from "../config/db.js";

export const getProducts = (req, res) => {
  const { umkm_id } = req.query;
  db.query("SELECT * FROM products WHERE umkm_id = ?", [umkm_id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

export const addProduct = (req, res) => {
  const { name, stock, price, umkm_id } = req.body;
  db.query(
    "INSERT INTO products (name, stock, price, umkm_id) VALUES (?, ?, ?, ?)",
    [name, stock, price, umkm_id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "Produk ditambahkan" });
    }
  );
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, stock, price } = req.body;
  db.query(
    "UPDATE products SET name=?, stock=?, price=? WHERE id=?",
    [name, stock, price, id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Produk diperbarui" });
    }
  );
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Produk dihapus" });
  });
};
