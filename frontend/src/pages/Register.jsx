import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin', umkm_name: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Cari UMKM berdasarkan nama
      const umkmRes = await axios.get('http://localhost:5000/api/umkm');
      let umkm = umkmRes.data.find(u => u.name.toLowerCase() === formData.umkm_name.trim().toLowerCase());
      let umkm_id;
      if (!umkm) {
        // 2. Jika belum ada, buat UMKM baru
        const createRes = await axios.post('http://localhost:5000/api/umkm', {
          name: formData.umkm_name,
          alamat: '-',
          pemilik: formData.name
        });
        umkm_id = createRes.data.id;
      } else {
        umkm_id = umkm.id;
      }
      // 3. Register user dengan umkm_id
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        umkm_id
      });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrasi UMKM</h2>
        <input
          type="text"
          name="name"
          placeholder="Nama"
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="kasir">Kasir</option>
        </select>
        <input
          type="text"
          name="umkm_name"
          placeholder="Nama Usaha/UMKM"
          className="w-full p-3 mb-6 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.umkm_name}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 p-3 rounded-lg font-bold text-lg transition mb-2 mt-2 shadow-lg">
          Daftar
        </button>
      </form>
    </div>
  );
}

export default Register;