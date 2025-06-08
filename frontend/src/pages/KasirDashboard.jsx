import { useEffect, useState } from "react";
import axios from "axios";

function KasirDashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

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

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, qty) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/transactions",
        {
          items: cart,
          user_id: user.id,
          umkm_id: user.umkm_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Transaksi berhasil!");
      setCart([]);
    } catch (err) {
      console.error("Error creating transaction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Transaksi Penjualan (Kasir)</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Daftar Produk */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Daftar Produk</h2>
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-gray-800 p-2 rounded mb-2"
            >
              <div>{product.name}</div>
              <div>
                <span className="mr-2">Rp {product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 px-2 py-1 rounded"
                >
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Keranjang */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Keranjang</h2>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-gray-800 p-2 rounded mb-2"
            >
              <div>{item.name}</div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                min={1}
                className="w-16 bg-gray-700 rounded text-center"
              />
              <div>Rp {item.price * item.quantity}</div>
            </div>
          ))}
          <div className="mt-4 font-bold">Total: Rp {total}</div>
          {cart.length > 0 && (
            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 p-2 rounded"
            >
              Simpan Transaksi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default KasirDashboard;