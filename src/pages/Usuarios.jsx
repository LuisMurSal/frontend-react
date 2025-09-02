import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building } from "lucide-react";

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  const allUsers = [
    { id: 1, nombre: "Juan Pérez", empresaId: 1 },
    { id: 2, nombre: "María Gómez", empresaId: 2 },
    { id: 3, nombre: "Carlos López", empresaId: 1 },
    { id: 4, nombre: "Ana Torres", empresaId: 3 },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/");

    if (user.role === "admin") {
      setUsuarios(allUsers);
    } else if (user.role === "empresa") {
      setUsuarios(allUsers.filter(u => u.empresaId === user.empresaId));
    } else {
      setUsuarios([]);
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
        <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">ID</th>
                <th className="border-b border-gray-300 p-2">Nombre</th>
                <th className="border-b border-gray-300 p-2">Empresa</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td className="border-b border-gray-300 p-2">{u.id}</td>
                  <td className="border-b border-gray-300 p-2">{u.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{u.empresaId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
