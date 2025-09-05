import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../services/supabase";

export default function DashboardCliente() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [dispositivosActivos, setDispositivosActivos] = useState([]);

  const isMobile = window.innerWidth < 768;

  // Validación de sesión y rol
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/");
    if (user.role !== "cliente") {
      switch (user.role) {
        case "admin":
          navigate("/dashboard-admin");
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
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      // Obtener dispositivos asignados a la empresa del cliente
      const { data: dispositivosData, error: dispositivosError } = await supabase
        .from("dispositivos")
        .select("*")
        .eq("empresa_id", user.empresa_id);

      if (!dispositivosError && dispositivosData) {
        const switchesEncendidos = dispositivosData.filter(d => d.estado).length;

        // Agrupar dispositivos por hora
        const grouped = dispositivosData
          .map(d => ({
            hora: new Date(d.created_at).getHours() + ":00",
            dispositivos: 1,
            switches: d.estado ? 1 : 0
          }))
          .reduce((acc, curr) => {
            const found = acc.find(a => a.hora === curr.hora);
            if (found) {
              found.dispositivos += curr.dispositivos;
              found.switches += curr.switches;
            } else acc.push({ ...curr });
            return acc;
          }, []);

        setDispositivosActivos(grouped);

        setStats([
          { label: "Switches Encendidos", value: switchesEncendidos, icon: Box, bg: "bg-[#6a994e]" }
        ]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, Cliente</h1>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map(stat => {
            const IconComp = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center p-6 rounded-xl shadow-md ${stat.bg} text-white`}
              >
                <IconComp className="w-10 h-10 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráfica de dispositivos */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dispositivos Activos / Switches Encendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dispositivosActivos}
              margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" tick={isMobile ? false : undefined} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dispositivos" stroke="#4f772d" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="switches" stroke="#6a994e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
