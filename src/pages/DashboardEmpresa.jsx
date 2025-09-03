import { LayoutDashboard, Users, Box, Server, Calendar, Power, PowerOff, RefreshCcw } from "lucide-react"

export default function DashboardEmpresa() {
  const stats = [
    { label: "Clientes", value: 10, icon: Users, bg: "bg-[#a7c957]" },
    { label: "Productos disponibles", value: 20, icon: Box, bg: "bg-[#6a994e]" },
    { label: "Ingresos totales", value: "$5,600", icon: Box, bg: "bg-[#f2e8cf] text-[#4f772d]" },
  ]

  const datosEmpresa = {
    nombre: "AgroTech S.A.",
    usuarios: 8,
    usuariosPermitidos: 15,
    switches: 5,
    dispositivos: 3,
    vencimiento: "2025-12-31",
  }

  // Dispositivos asignados
  const dispositivosAsignados = [
    { nombre: "TRIFÁSICO", estado: "ONLINE", ultimaConexion: "hace 4m", potencia: "39.48 W" },
    { nombre: "MONOFÁSICO", estado: "OFFLINE", ultimaConexion: "hace 15m", potencia: "0.00 W" },
    { nombre: "GENERADOR", estado: "ONLINE", ultimaConexion: "hace 1m", potencia: "12.87 W" },
  ]

  const manejarAccion = (accion, dispositivo) => {
    console.log(`Acción: ${accion} en ${dispositivo.nombre}`)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, Empresa</h1>

        {/* Stats principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const IconComp = stat.icon
            return (
              <div 
                key={stat.label} 
                className={`flex items-center p-6 rounded-xl shadow-md ${stat.bg}`}
              >
                <IconComp className="w-10 h-10 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Datos generales */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
          <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Nombre de la empresa:</strong> {datosEmpresa.nombre}</div>
            <div><strong>Usuarios:</strong> {datosEmpresa.usuarios} / {datosEmpresa.usuariosPermitidos}</div>
            <div><strong>Switches:</strong> {datosEmpresa.switches}</div>
            <div><strong>Dispositivos:</strong> {datosEmpresa.dispositivos}</div>
            <div className="md:col-span-2">
              <strong>Vencimiento:</strong> {datosEmpresa.vencimiento}
            </div>
          </div>
        </div>

        {/* Dispositivos asignados */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Dispositivos Asignados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dispositivosAsignados.map((d, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-bold">{d.nombre}</h3>
                <p className={`mt-1 font-semibold ${d.estado === "ONLINE" ? "text-green-600" : "text-red-600"}`}>
                  {d.estado}
                </p>
                <p className="text-gray-500 text-sm">{d.ultimaConexion}</p>
                <p className="mt-2"><strong>P. Activa:</strong> {d.potencia}</p>

                {/* Botones de acción */}
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => manejarAccion("Prender", d)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                  >
                    <Power className="w-4 h-4" /> Prender
                  </button>
                  <button 
                    onClick={() => manejarAccion("Apagar", d)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <PowerOff className="w-4 h-4" /> Apagar
                  </button>
                  <button 
                    onClick={() => manejarAccion("Refrescar", d)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    <RefreshCcw className="w-4 h-4" /> Refrescar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividades */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Últimas Actividades</h2>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-600">Aquí puedes mostrar la actividad de tus clientes y productos.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
