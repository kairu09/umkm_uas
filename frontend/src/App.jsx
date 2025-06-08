import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import KasirDashboard from "./pages/KasirDashboard";
import AdminProducts from "./pages/AdminProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminReports from "./pages/AdminReports";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman bebas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Halaman untuk admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

        {/* Halaman untuk kasir */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={['kasir']}>
              <KasirDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
