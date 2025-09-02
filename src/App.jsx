import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import DashboardEmpresa from "./pages/DashboardEmpresa";
import Empresa from "./pages/Empresas";
import Usuarios from "./pages/Usuarios";
import Sidebar from "./components/Sidebar";

// Ruta privada según rol
function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) {
    switch(user.role) {
      case "admin": return <Navigate to="/dashboard-admin" />;
      case "cliente": return <Navigate to="/dashboard-cliente" />;
      case "empresa": return <Navigate to="/dashboard-empresa" />;
      default: return <Navigate to="/" />;
    }
  }

  return children;
}

// Layout que incluye el sidebar
function ProtectedLayout({ children, isCollapsed, setIsCollapsed, isOpen, setIsOpen }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        {children}
      </main>
    </div>
  );
}

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route 
          path="/dashboard-admin" 
          element={
            <PrivateRoute role="admin">
              <ProtectedLayout 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
              >
                <DashboardAdmin />
              </ProtectedLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard-cliente" 
          element={
            <PrivateRoute role="cliente">
              <ProtectedLayout 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
              >
                <DashboardCliente />
              </ProtectedLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard-empresa" 
          element={
            <PrivateRoute role="empresa">
              <ProtectedLayout 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
              >
                <DashboardEmpresa />
              </ProtectedLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/empresas" 
          element={
            <PrivateRoute role="admin">
              <ProtectedLayout 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
              >
                <Empresa />
              </ProtectedLayout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <PrivateRoute role="admin">
              <ProtectedLayout 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen}
              >
                <Usuarios />
              </ProtectedLayout>
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
