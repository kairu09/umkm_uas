import { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", stock: "", price: "" });
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");


  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products?umkm_id=${user.umkm_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          { ...form, umkm_id: user.umkm_id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setForm({ name: "", stock: "", price: "" });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, stock: product.stock, price: product.price });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-center w-full flex justify-center items-center min-h-[60px]">Manajemen Produk</h1>
          <p className="text-gray-300 mt-2">Admin: <span className="font-semibold text-blue-300">{user.name}</span></p>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 w-full">
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              type="text"
              name="name"
              placeholder="Nama"
              value={form.name}
              onChange={handleChange}
              className="p-2 m-2 bg-gray-700 rounded"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stok"
              value={form.stock}
              onChange={handleChange}
              className="p-2 m-2 bg-gray-700 rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Harga"
              value={form.price}
              onChange={handleChange}
              className="p-2 m-2 bg-gray-700 rounded"
              required
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              {editId ? "Update" : "Tambah"}
            </button>
          </form>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full">
          <table className="w-full text-left bg-gray-800 rounded">
            <thead>
              <tr>
                <th className="p-2">Nama</th>
                <th className="p-2">Stok</th>
                <th className="p-2">Harga</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">{p.price}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-600 px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => window.history.back()} className="mt-8 bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition shadow">Kembali</button>
      </div>
    </div>
  );
}

export default AdminProducts;