import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import DashboardEmpresa from "./pages/DashboardEmpresa";

// Ruta privada según rol
function PrivateRoute({ children, role }) {
  // Ejemplo: guardamos usuario en localStorage al loguearse
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!user) {
    // Si no hay usuario logueado, redirige a login
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    // Si el rol no coincide, redirige a su dashboard correspondiente
    switch(user.role) {
      case "admin": return <Navigate to="/dashboard-admin" />;
      case "cliente": return <Navigate to="/dashboard-cliente" />;
      case "empresa": return <Navigate to="/dashboard-empresa" />;
      default: return <Navigate to="/" />;
    }
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboards protegidos */}
        <Route 
          path="/dashboard-admin" 
          element={
            <PrivateRoute role="admin">
              <DashboardAdmin />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard-cliente" 
          element={
            <PrivateRoute role="cliente">
              <DashboardCliente />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard-empresa" 
          element={
            <PrivateRoute role="empresa">
              <DashboardEmpresa />
            </PrivateRoute>
          } 
        />

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
