import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminReports() {
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [filter, setFilter] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchDaily = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/daily?start=${filter.start}&end=${filter.end}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDaily(res.data);
    } catch (err) {
      console.error("Error fetching daily report:", err);
    }
  };

  const fetchMonthly = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/reports/monthly",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMonthly(res.data);
    } catch (err) {
      console.error("Error fetching monthly report:", err);
    }
  };

  useEffect(() => {
    fetchDaily();
    fetchMonthly();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDaily();
  };

  const exportDailyToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Penjualan Harian", 14, 15);

    const tableData = daily.map((d) => [
      d.tanggal,
      d.jumlah_transaksi,
      `Rp ${d.total_omzet}`,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Tanggal", "Jumlah Transaksi", "Total Omzet"]],
      body: tableData,
    });

    doc.save("laporan-harian.pdf");
  };

  const exportMonthlyToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Penjualan Bulanan", 14, 15);

    const tableData = monthly.map((m) => [
      m.bulan,
      m.jumlah_transaksi,
      `Rp ${m.total_omzet}`,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Bulan", "Jumlah Transaksi", "Total Omzet"]],
      body: tableData,
    });

    doc.save("laporan-bulanan.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-center w-full flex justify-center items-center min-h-[60px]">
            Laporan Penjualan
          </h1>
          <p className="text-gray-300 mt-2">
            Admin:{" "}
            <span className="font-semibold text-blue-300">{user.name}</span>
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 w-full">
          {/* Filter Tanggal */}
          <form
            onSubmit={handleFilterSubmit}
            className="mb-6 flex flex-wrap gap-4 items-end"
          >
            <div>
              <label className="block mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={filter.start}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, start: e.target.value }))
                }
                className="bg-gray-700 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={filter.end}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, end: e.target.value }))
                }
                className="bg-gray-700 p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Filter
            </button>
          </form>

          {/* Tabel Harian */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-2">Laporan Harian</h2>
              <button
                onClick={exportDailyToPDF}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                Export Harian ke PDF
              </button>
            </div>
            <table className="w-full bg-gray-800 rounded text-left">
              <thead>
                <tr>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Jumlah Transaksi</th>
                  <th className="p-2">Total Omzet</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((d, i) => (
                  <tr key={i}>
                    <td className="p-2">{d.tanggal}</td>
                    <td className="p-2">{d.jumlah_transaksi}</td>
                    <td className="p-2">Rp {d.total_omzet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grafik Harian */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-2">Grafik Omzet Harian</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tanggal" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total_omzet" stroke="#00bfff" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabel Bulanan */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-2">Laporan Bulanan</h2>
              <button
                onClick={exportMonthlyToPDF}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              >
                Export Bulanan ke PDF
              </button>
            </div>
            <table className="w-full bg-gray-800 rounded text-left">
              <thead>
                <tr>
                  <th className="p-2">Bulan</th>
                  <th className="p-2">Jumlah Transaksi</th>
                  <th className="p-2">Total Omzet</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m, i) => (
                  <tr key={i}>
                    <td className="p-2">{m.bulan}</td>
                    <td className="p-2">{m.jumlah_transaksi}</td>
                    <td className="p-2">Rp {m.total_omzet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-8 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition shadow"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

export default AdminReports;