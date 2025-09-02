import { useState } from "react"
import Sidebar from "../components/Sidebar"
import { LayoutDashboard, Box } from "lucide-react"

export default function DashboardCliente() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Links específicos del cliente
  const clienteLinks = [
    { to: "/dashboard-cliente", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/mis-productos", icon: Box, label: "Mis Productos" },
  ]

  // Datos de ejemplo para las cards
  const stats = [
    { label: "Productos adquiridos", value: 5, icon: Box, bg: "bg-[#a7c957]" },
    { label: "Total gastado", value: "$1,250", icon: Box, bg: "bg-[#6a994e]" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        links={clienteLinks}
      />

      <main className="flex-1 p-6 md:ml-64">
        <h1 className="text-3xl font-bold mb-6">Bienvenido, Cliente</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <h2 className="text-xl font-semibold mb-4">Mis Productos</h2>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-600">Aquí puedes listar los productos asignados al cliente.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
