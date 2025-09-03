import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const allUsers = [
  { id: 1, nombre: "Juan Pérez", empresa: "AgroTech S.A." },
  { id: 2, nombre: "María Gómez", empresa: "GreenFields" },
  { id: 3, nombre: "Carlos López", empresa: "AgroTech S.A." },
  { id: 4, nombre: "Ana Torres", empresa: "Pulso Agro" },
];

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/");

    if (user.role === "admin") {
      setUsuarios(allUsers);
    } else if (user.role === "empresa") {
      setUsuarios(allUsers.filter(u => u.empresa === user.empresa));
    } else {
      setUsuarios([]);
    }
  }, [navigate]);

  const openModal = (user = null) => {
    setUsuarioEdit(user ? { ...user } : { id: null, nombre: "", empresa: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
    }, 200);
  };

  const handleChange = (e) => setUsuarioEdit({ ...usuarioEdit, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (usuarioEdit.id) {
      setUsuarios(usuarios.map(u => (u.id === usuarioEdit.id ? usuarioEdit : u)));
    } else {
      const newUser = { ...usuarioEdit, id: usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1 };
      setUsuarios([...usuarios, newUser]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (window.confirm("¿Eliminar este usuario?")) {
      setUsuarios(usuarios.filter(u => u.id !== usuarioEdit.id));
      closeModal();
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <div className=" mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <div className="mt-3 md:mt-0 md:flex md:justify-end">
            <button className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors">
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">ID</th>
                <th className="border-b border-gray-300 p-2">Nombre</th>
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td className="border-b border-gray-300 p-2">{u.id}</td>
                  <td className="border-b border-gray-300 p-2">{u.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{u.empresa}</td>
                  <td className="border-b border-gray-300 p-2">
                    <button
                      onClick={() => openModal(u)}
                      className="px-3 py-1 bg-[#a7c957] text-white rounded-full hover:bg-[#6a994e] transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {usuarios.map(u => (
            <div key={u.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>ID:</strong> {u.id}</div>
              <div><strong>Nombre:</strong> {u.nombre}</div>
              <div><strong>Empresa:</strong> {u.empresa}</div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => openModal(u)}
                  className="bg-[#a7c957] text-white px-3 py-1 rounded-full hover:bg-[#6a994e] transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${closing ? "opacity-0" : "opacity-100"}`}></div>

            <div className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${closing ? "animate-modal-out" : "animate-modal-in"}`}>
              <h2 className="text-xl font-bold mb-4">{usuarioEdit?.id ? "Editar Usuario" : "Nuevo Usuario"}</h2>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioEdit.nombre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={usuarioEdit.empresa}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors">
                  Cancelar
                </button>
                {usuarioEdit?.id && (
                  <button onClick={handleDelete} className="px-4 py-2 rounded-full bg-[#bc4749] text-white hover:bg-[#a63d3f] transition-colors">
                    Eliminar
                  </button>
                )}
                <button onClick={handleSave} className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
