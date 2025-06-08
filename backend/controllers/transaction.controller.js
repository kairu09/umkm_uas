import db from "../config/db.js";

export const createTransaction = (req, res) => {
  const { items, user_id, umkm_id } = req.body;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cek stok cukup untuk semua item
  const checkStockPromises = items.map((item) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT stock FROM products WHERE id = ?", [item.id], (err, result) => {
        if (err) return reject(err);
        if (result.length === 0 || result[0].stock < item.quantity) {
          return reject(new Error(`Stok tidak cukup untuk produk ID ${item.id}`));
        }
        resolve();
      });
    });
  });

  Promise.all(checkStockPromises)
    .then(() => {
      db.query(
        "INSERT INTO transactions (total, user_id, umkm_id) VALUES (?, ?, ?)",
        [total, user_id, umkm_id],
        (err, result) => {
          if (err) return res.status(500).json({ message: err.message });

          const transaction_id = result.insertId;
          const values = items.map((item) => [
            transaction_id,
            item.id,
            item.quantity,
            item.price * item.quantity,
          ]);

          db.query(
            "INSERT INTO transaction_items (transaction_id, product_id, quantity, subtotal) VALUES ?",
            [values],
            (err2) => {
              if (err2) return res.status(500).json({ message: err2.message });

              // Kurangi stok produk
              items.forEach((item) => {
                db.query(
                  "UPDATE products SET stock = stock - ? WHERE id = ?",
                  [item.quantity, item.id],
                  (err3) => {
                    if (err3)
                      console.error(`Gagal update stok produk ID ${item.id}`);
                  }
                );
              });

              res.status(201).json({ message: "Transaksi berhasil disimpan" });
            }
          );
        }
      );
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const getTransactions = (req, res) => {
  const { umkm_id } = req.query;
  db.query("SELECT * FROM transactions WHERE umkm_id = ?", [umkm_id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};
