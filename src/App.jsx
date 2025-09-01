import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardCliente from "./pages/DashboardCliente";
import DashboardEmpresa from "./pages/DashboardEmpresa";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-cliente" element={<DashboardCliente />} />
        <Route path="/dashboard-empresa" element={<DashboardEmpresa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
