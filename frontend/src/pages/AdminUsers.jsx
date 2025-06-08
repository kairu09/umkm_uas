import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(
        (u) => u.role === "kasir" && u.umkm_id === user.umkm_id
      );
      setUsers(filtered);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/users/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          { ...form, role: "kasir", umkm_id: user.umkm_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setForm({ name: "", email: "", password: "" });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error("Gagal menyimpan kasir:", err);
    }
  };

  const handleEdit = (kasir) => {
    setForm({ name: kasir.name, email: kasir.email, password: "" });
    setEditId(kasir.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kasir ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Gagal hapus kasir:", err);
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manajemen Kasir</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6">
        <div className="mb-2">
          <label className="block mb-1">Nama</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 rounded bg-gray-700"
            required={!editId}
          />
        </div>
        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          {editId ? "Update Kasir" : "Tambah Kasir"}
        </button>
      </form>

      <table className="w-full bg-gray-800 rounded text-left">
        <thead>
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">Email</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-600 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;