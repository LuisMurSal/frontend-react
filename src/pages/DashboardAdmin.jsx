import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Cpu, Server, Building } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from "../services/supabase";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [ultimosUsuarios, setUltimosUsuarios] = useState([]);
  const [ultimasEmpresas, setUltimasEmpresas] = useState([]);
  const [dispositivosActivos, setDispositivosActivos] = useState([]);
  const [usuariosPorEmpresa, setUsuariosPorEmpresa] = useState([]);

  const isMobile = window.innerWidth < 768; // Detecta pantalla móvil

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/");
    if (user.role !== "admin") {
      switch (user.role) {
        case "cliente":
          navigate("/dashboard-cliente");
          break;
        case "empresa":
          navigate("/dashboard-empresa");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      // --- Últimos usuarios (solo 5) ---
      const { data: usuariosData, error: usuariosError } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (usuariosError) console.error(usuariosError);
      else setUltimosUsuarios(usuariosData || []);

      // --- Todas las empresas ---
      const { data: empresasData, error: empresasError } = await supabase
        .from("empresas")
        .select("*")
        .order("created_at", { ascending: false });
      if (empresasError) console.error(empresasError);
      else setUltimasEmpresas(empresasData || []);

      // --- Estadísticas ---
      const { count: totalUsuarios } = await supabase.from("usuarios").select("*", { count: "exact" });
      const { count: totalEmpresas } = await supabase.from("empresas").select("*", { count: "exact" });
      setStats([
        { label: "Usuarios Totales", value: totalUsuarios || 0, icon: Users, bg: "bg-[#a7c957]" },
        { label: "Empresas Totales", value: totalEmpresas || 0, icon: Building, bg: "bg-[#6a994e]" },
        { label: "Switches Encendidos", value: 32, icon: Server, bg: "bg-[#f2e8cf] text-[#4f772d]" },
      ]);

      // --- Usuarios por empresa ---
      const { data: todosUsuarios, error: allUsersError } = await supabase.from("usuarios").select("empresa_id");
      if (allUsersError) console.error(allUsersError);
      else if (empresasData) {
        const countData = empresasData.map(emp => {
          const count = todosUsuarios.filter(u => u.empresa_id === emp.id).length;
          return { nombre: emp.nombre, usuarios: count };
        });
        setUsuariosPorEmpresa(countData);
      }

      // --- Dispositivos activos (ejemplo) ---
      setDispositivosActivos([
        { hora: "08:00", dispositivos: 12, switches: 5 },
        { hora: "09:00", dispositivos: 18, switches: 7 },
        { hora: "10:00", dispositivos: 20, switches: 10 },
        { hora: "11:00", dispositivos: 17, switches: 8 },
        { hora: "12:00", dispositivos: 25, switches: 12 },
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, Admin</h1>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(stat => {
            const IconComp = stat.icon;
            return (
              <div key={stat.label} className={`flex items-center p-6 rounded-xl shadow-md ${stat.bg}`}>
                <IconComp className="w-10 h-10 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gráfica de dispositivos */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dispositivos Activos / Switches Encendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dispositivosActivos} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" tick={isMobile ? false : undefined} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dispositivos" stroke="#4f772d" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="switches" stroke="#6a994e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de usuarios por empresa */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Usuarios por Empresa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usuariosPorEmpresa}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" tick={isMobile ? false : undefined} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="usuarios" fill="#6a994e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Últimos usuarios y empresas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Últimos 3 usuarios */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Últimos Usuarios</h2>
            <ul className="space-y-2">
              {ultimosUsuarios.slice(0, 3).map(u => (
                <li key={u.id} className="border-b pb-1 border-gray-300">
                  <p className="font-medium">{u.nombre}</p>
                  <p className="text-sm text-gray-500">{u.correo}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Últimas 3 empresas */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Últimas Empresas</h2>
            <ul className="space-y-2">
              {ultimasEmpresas.slice(0, 3).map(e => (
                <li key={e.id} className="border-b pb-1 border-gray-300">
                  <p className="font-medium">{e.nombre}</p>
                  {e.correo && <p className="text-sm text-gray-500">{e.correo}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
