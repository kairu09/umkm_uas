import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UMKMRegister() {
  const [umkm, setUmkm] = useState({ name: "", alamat: "", pemilik: "" });
  const [admin, setAdmin] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Simpan UMKM
      const res1 = await axios.post("http://localhost:5000/api/umkm", umkm);
      const umkm_id = res1.data.id;

      // 2. Buat akun admin
      await axios.post("http://localhost:5000/api/auth/register", {
        ...admin,
        role: "admin",
        umkm_id,
      });

      alert("Pendaftaran UMKM & Admin berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error("Gagal daftar:", err);
      alert("Terjadi kesalahan saat mendaftar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Pendaftaran UMKM</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block">Nama UMKM</label>
          <input
            type="text"
            value={umkm.name}
            onChange={(e) => setUmkm({ ...umkm, name: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Alamat</label>
          <textarea
            value={umkm.alamat}
            onChange={(e) => setUmkm({ ...umkm, alamat: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Nama Pemilik</label>
          <input
            type="text"
            value={umkm.pemilik}
            onChange={(e) => setUmkm({ ...umkm, pemilik: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <hr className="border-gray-600" />
        <div>
          <label className="block">Nama Admin</label>
          <input
            type="text"
            value={admin.name}
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            value={admin.email}
            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            value={admin.password}
            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 p-2 rounded">
          Daftar UMKM
        </button>
      </form>
    </div>
  );
}

export default UMKMRegister;