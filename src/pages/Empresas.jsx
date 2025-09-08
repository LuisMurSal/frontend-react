import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import ModalEmpresas from "../components/ModalEmpresas";

export default function Empresa() {
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState(null);

  // --- Fetch empresas desde Supabase ---
  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data, error } = await supabase.from("empresas").select("*");
      if (error) console.error("Error fetching empresas:", error);
      else setEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  const openModal = (empresa = null) => {
    setEmpresaEdit(
      empresa
        ? { ...empresa }
        : { id: null, nombre: "", telefono: "", correo: "", vencimiento: "" }
    );
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = (updatedEmpresa) => {
    // Actualiza el array de empresas según si es nueva o editada
    if (updatedEmpresa.id) {
      setEmpresas(
        empresas.map((e) => (e.id === updatedEmpresa.id ? updatedEmpresa : e))
      );
    } else {
      setEmpresas([...empresas, updatedEmpresa]);
    }
    closeModal();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Empresas</h1>
          <div className="mt-3 md:mt-0 md:flex md:justify-end">
            <button
              onClick={() => openModal()}
              className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors"
            >
              Nueva empresa
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
                <th className="border-b border-gray-300 p-2">Teléfono</th>
                <th className="border-b border-gray-300 p-2">Correo</th>
                <th className="border-b border-gray-300 p-2">Vencimiento</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id}>
                  <td className="border-b border-gray-300 p-2">{e.id}</td>
                  <td className="border-b border-gray-300 p-2">{e.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{e.telefono}</td>
                  <td className="border-b border-gray-300 p-2">{e.correo}</td>
                  <td className="border-b border-gray-300 p-2">{e.vencimiento}</td>
                  <td className="border-b border-gray-300 p-2">
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

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {empresas.map((e) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2"
            >
              <div>
                <strong>ID:</strong> {e.id}
              </div>
              <div>
                <strong>Nombre:</strong> {e.nombre}
              </div>
              <div>
                <strong>Teléfono:</strong> {e.telefono}
              </div>
              <div>
                <strong>Correo:</strong> {e.correo}
              </div>
              <div>
                <strong>Vencimiento:</strong> {e.vencimiento}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => openModal(e)}
                  className="bg-[#a7c957] text-white px-3 py-1 rounded-full hover:bg-[#6a994e] transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <ModalEmpresas
          isOpen={modalOpen}
          empresa={empresaEdit}
          onClose={closeModal}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
