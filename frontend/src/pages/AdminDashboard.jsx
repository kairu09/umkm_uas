import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    products: 0,
    transactions: 0,
    cashiers: 0,
  });
  const [umkmName, setUmkmName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [prodRes, trxRes, userRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products?umkm_id=${user.umkm_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/api/transactions?umkm_id=${user.umkm_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const cashiers = userRes.data.filter(u => u.role === "kasir" && u.umkm_id === user.umkm_id);

        setSummary({
          products: prodRes.data.length,
          transactions: trxRes.data.length,
          cashiers: cashiers.length,
        });
      } catch {
        // error log sudah cukup di atas
      }
    };
    const fetchUmkmName = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/umkm");
        const umkm = res.data.find((u) => u.id === user.umkm_id);
        setUmkmName(umkm ? umkm.name : "-");
      } catch {
        setUmkmName("-");
      }
    };
    fetchSummary();
    fetchUmkmName();
  }, [token, user.umkm_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-center w-full flex justify-center items-center min-h-[60px]">{umkmName}</h1>
          <p className="text-gray-300 mt-2">Selamat datang kembali, <span className="font-semibold text-blue-300">{user.name}</span>!</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition shadow"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold mb-1">Total Produk</h2>
            <p className="text-4xl font-extrabold text-white drop-shadow">{summary.products}</p>
          </div>
          <div className="bg-gradient-to-br from-green-700 to-green-500 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold mb-1">Transaksi</h2>
            <p className="text-4xl font-extrabold text-white drop-shadow">{summary.transactions}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-400 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold mb-1">Jumlah Kasir</h2>
            <p className="text-4xl font-extrabold text-white drop-shadow">{summary.cashiers}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/admin/products" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition shadow">
            Kelola Produk
          </Link>
          <Link to="/admin/reports" className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition shadow">
            Laporan Penjualan
          </Link>
          <Link to="/admin/users" className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold transition shadow">
            Kelola Kasir
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
