// src/pages/DashboardAdmin.jsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, Cpu, Server, Building } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardAdmin() {
  const navigate = useNavigate()

  // 🔒 Protección: solo admin puede entrar
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
      navigate("/") // no logueado -> login
    } else if (user.role !== "admin") {
      switch (user.role) {
        case "cliente":
          navigate("/dashboard-cliente")
          break
        case "empresa":
          navigate("/dashboard-empresa")
          break
        default:
          navigate("/")
      }
    }
  }, [navigate])

  // Datos de ejemplo
  const stats = [
    { label: "Usuarios Totales", value: 120, icon: Users, bg: "bg-[#a7c957]" },
    { label: "Empresas Totales", value: 45, icon: Building, bg: "bg-[#6a994e]" },
    { label: "Switches Encendidos", value: 32, icon: Server, bg: "bg-[#f2e8cf] text-[#4f772d]" },
  ]

  const ultimosUsuarios = [
    { id: 1, nombre: "Juan Perez", email: "juan@mail.com" },
    { id: 2, nombre: "Ana Gomez", email: "ana@mail.com" },
    { id: 3, nombre: "Carlos Ruiz", email: "carlos@mail.com" },
  ]
  const ultimasEmpresas = [
    { id: 1, nombre: "AgroTech S.A." },
    { id: 2, nombre: "GreenFields" },
    { id: 3, nombre: "Pulso Agro" },
  ]
  const ultimosDispositivos = [
    { id: 1, nombre: "Sensor de humedad 1", tipo: "Sensor" },
    { id: 2, nombre: "Controlador 5", tipo: "Switch" },
    { id: 3, nombre: "Cámara 3", tipo: "Cámara" },
  ]
  const dispositivosActivos = [
    { hora: "08:00", dispositivos: 12, switches: 5 },
    { hora: "09:00", dispositivos: 18, switches: 7 },
    { hora: "10:00", dispositivos: 20, switches: 10 },
    { hora: "11:00", dispositivos: 17, switches: 8 },
    { hora: "12:00", dispositivos: 25, switches: 12 },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, Admin</h1>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(stat => {
            const IconComp = stat.icon
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

        {/* Gráfica */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dispositivos Activos / Switches Encendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dispositivosActivos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="dispositivos" stroke="#4f772d" activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="switches" stroke="#6a994e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Últimos usuarios y empresas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Últimos Usuarios</h2>
            <ul className="space-y-2">
              {ultimosUsuarios.map(u => (
                <li key={u.id} className="border-b pb-1 border-gray-300">
                  <p className="font-medium">{u.nombre}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Últimas Empresas</h2>
            <ul className="space-y-2">
              {ultimasEmpresas.map(e => (
                <li key={e.id} className="border-b pb-1 border-gray-300">
                  <p className="font-medium">{e.nombre}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Últimos dispositivos */}
        <div className="mt-8 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Últimos Dispositivos</h2>
          <ul className="space-y-2">
            {ultimosDispositivos.map(d => (
              <li key={d.id} className="border-b pb-1 border-gray-300">
                <p className="font-medium">{d.nombre}</p>
                <p className="text-sm text-gray-500">{d.tipo}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
