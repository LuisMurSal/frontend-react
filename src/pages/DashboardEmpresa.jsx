import { useState } from "react"
import Sidebar from "../components/Sidebar"
import { LayoutDashboard, Users, Box } from "lucide-react"

export default function DashboardEmpresa() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Links específicos de la empresa
  const empresaLinks = [
    { to: "/dashboard-empresa", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/mis-clientes", icon: Users, label: "Mis Clientes" },
    { to: "/productos", icon: Box, label: "Productos" },
  ]

  // Datos de ejemplo para las cards
  const stats = [
    { label: "Clientes", value: 10, icon: Users, bg: "bg-[#a7c957]" },
    { label: "Productos disponibles", value: 20, icon: Box, bg: "bg-[#6a994e]" },
    { label: "Ingresos totales", value: "$5,600", icon: Box, bg: "bg-[#f2e8cf] text-[#4f772d]" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        links={empresaLinks}
      />

      <main className="flex-1 p-6 md:ml-64">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, Empresa</h1>

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
