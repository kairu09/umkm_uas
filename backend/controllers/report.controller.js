import db from "../config/db.js";

export const getDailyReport = (req, res) => {
  const { start, end } = req.query;

  const sql = `
    SELECT DATE(date) AS tanggal, COUNT(*) AS jumlah_transaksi, SUM(total) AS total_omzet
    FROM transactions
    WHERE DATE(date) BETWEEN ? AND ?
    GROUP BY DATE(date)
    ORDER BY tanggal DESC
  `;

  db.query(sql, [start, end], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};


export const getMonthlyReport = (req, res) => {
  db.query(
    `SELECT DATE_FORMAT(date, '%Y-%m') AS bulan, COUNT(*) AS jumlah_transaksi, SUM(total) AS total_omzet
     FROM transactions
     GROUP BY DATE_FORMAT(date, '%Y-%m')
     ORDER BY bulan DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
};
