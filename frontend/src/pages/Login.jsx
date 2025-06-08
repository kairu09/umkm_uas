import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // simpan umkm_id juga

      // Redirect berdasarkan role
      if (user.role === 'admin') navigate('/dashboard');
      else navigate('/transactions');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login UMKM</h2>
        <input
          type="email"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">Login</button>
        <p className="mt-4 text-sm text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;