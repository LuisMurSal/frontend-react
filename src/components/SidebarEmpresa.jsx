import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LogOut, ChevronLeft, ChevronRight, Menu, X, Snail, LayoutDashboard, Users } from 'lucide-react'

export default function SidebarEmpresa({ 
  isCollapsed, 
  setIsCollapsed, 
  isOpen, 
  setIsOpen
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    setActive(location.pathname)
  }, [location.pathname])

  const handleLogout = () => {
    setClosing(true)
    setTimeout(() => {
      localStorage.removeItem("user")
      navigate('/')
    }, 500)
  }

  const linkStyle = (path) =>
    `${active === path ? 'bg-gray-50 text-[#4f772d]' : 'text-white hover:bg-gray-50 hover:text-[#4f772d]'}
     flex items-center px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
     ${isCollapsed ? 'justify-center' : 'space-x-3 justify-start'}`

  // Enlaces fijos para empresa
  const links = [
    { to: '/dashboard-empresa', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/usuarios', icon: Users, label: 'Usuarios' }
  ]

  return (
    <>
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          md:hidden fixed top-4 right-4 z-50 bg-[#4f772d] p-2 rounded text-white
          transition-opacity duration-500
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
        `}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#4f772d] shadow-md p-4 z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
          flex flex-col justify-between
        `}
        style={{ width: isCollapsed ? '80px' : '256px' }}
      >
        <div>
          {/* Botón cerrar (móvil) */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setIsOpen(false)} className="text-green-100">
              <X />
            </button>
          </div>

          {/* Logo */}
          <div className="hidden md:flex items-center justify-between mb-8">
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="text-green-100 hover:text-white mx-auto cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 transition-transform duration-300" />
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-2 mx-auto">
                  <Snail className="w-6 h-6 text-white" />
                  <h1 className="text-white font-bold text-2xl cursor-default">Pulso Agrícola</h1>
                </div>
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="text-green-100 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 transition-transform duration-300" />
                </button>
              </>
            )}
          </div>

          {/* Enlaces */}
          <nav className="space-y-2">
            {links.map((link) => {
              const IconComp = link.icon
              return (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className={linkStyle(link.to)} 
                  onClick={() => setIsOpen(false)}
                >
                  <IconComp className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Cerrar sesión */}
        <div>
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#31572c] text-white rounded-xl
              hover:bg-[#294b25] transition cursor-pointer
            "
          >
            {!closing && <LogOut className="w-5 h-5" />}
            {!isCollapsed && (
              <span className="flex items-center space-x-2 transition-opacity duration-300">
                {closing ? (
                  <>
                    {/* Spinner circular */}
                    <svg
                      className="w-4 h-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span>Cerrando sesión...</span>
                  </>
                ) : (
                  <span>Cerrar sesión</span>
                )}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
