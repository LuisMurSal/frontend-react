// src/pages/Empresa.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Empresa() {
  const [empresas, setEmpresas] = useState([
    { id: 1, nombre: "AgroTech S.A.", telefono: "555-1234", imei: "123456789012345", vencimiento: "2025-12-31" },
    { id: 2, nombre: "GreenFields", telefono: "555-5678", imei: "987654321098765", vencimiento: "2025-11-30" },
    { id: 3, nombre: "Pulso Agro", telefono: "555-9012", imei: "192837465091283", vencimiento: "2026-01-15" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  const openModal = (empresa) => {
    setEmpresaEdit({ ...empresa });
    setModalOpen(true);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
    }, 200);
  };

  const handleChange = (e) => {
    setEmpresaEdit({ ...empresaEdit, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEmpresas(empresas.map((emp) => (emp.id === empresaEdit.id ? empresaEdit : emp)));
    closeModal();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar unificado */}
      <Sidebar
        isCollapsed={false}
        setIsCollapsed={() => {}}
        isOpen={false}
        setIsOpen={() => {}}
        role="admin"
      />

      <main className="flex-1 p-6 md:ml-64">
        <h1 className="text-3xl font-bold mb-6">Empresas</h1>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">ID</th>
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Teléfono</th>
                <th className="border-b p-2">IMEI</th>
                <th className="border-b p-2">Vencimiento</th>
                <th className="border-b p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id}>
                  <td className="border-b p-2">{e.id}</td>
                  <td className="border-b p-2">{e.nombre}</td>
                  <td className="border-b p-2">{e.telefono}</td>
                  <td className="border-b p-2">{e.imei}</td>
                  <td className="border-b p-2">{e.vencimiento}</td>
                  <td className="border-b p-2">
                    <button
                      onClick={() => openModal(e)}
                      className="bg-[#a7c957] text-white px-3 py-1 rounded-full hover:bg-[#6a994e] transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo oscuro con blur */}
            <div
              className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${
                closing ? "opacity-0" : "opacity-100"
              }`}
            ></div>

            {/* Contenido modal */}
            <div
              className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${
                closing ? "animate-modal-out" : "animate-modal-in"
              }`}
            >
              <h2 className="text-xl font-bold mb-4">Editar Empresa</h2>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={empresaEdit.nombre}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={empresaEdit.telefono}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">IMEI</label>
                <input
                  type="text"
                  name="imei"
                  value={empresaEdit.imei}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Vencimiento</label>
                <input
                  type="date"
                  name="vencimiento"
                  value={empresaEdit.vencimiento}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full border hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e]"
                >
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
