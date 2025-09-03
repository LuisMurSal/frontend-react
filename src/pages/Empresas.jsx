import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Empresa() {
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [empresaEdit, setEmpresaEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  // --- Fetch empresas desde Supabase ---
  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data, error } = await supabase.from("empresas").select("*");
      if (error) console.error("Error fetching empresas:", error);
      else setEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  const openModal = (empresa) => {
    setEmpresaEdit(
      empresa
        ? { ...empresa }
        : { id: null, nombre: "", telefono: "", correo: "", vencimiento: "" }
    );
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

  const handleSave = async () => {
    if (empresaEdit.id) {
      // Editar empresa
      const { data, error } = await supabase
        .from("empresas")
        .update({
          nombre: empresaEdit.nombre,
          telefono: empresaEdit.telefono,
          correo: empresaEdit.correo,
          vencimiento: empresaEdit.vencimiento,
        })
        .eq("id", empresaEdit.id)
        .select();
      if (error) console.error("Error updating empresa:", error);
      else {
        setEmpresas(empresas.map((e) => (e.id === empresaEdit.id ? data[0] : e)));
      }
    } else {
      // Crear nueva empresa
      const { data, error } = await supabase
        .from("empresas")
        .insert([
          {
            nombre: empresaEdit.nombre,
            telefono: empresaEdit.telefono,
            correo: empresaEdit.correo,
            vencimiento: empresaEdit.vencimiento,
          },
        ])
        .select();
      if (error) console.error("Error creating empresa:", error);
      else setEmpresas([...empresas, data[0]]);
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
              onClick={() => openModal(null)}
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
            <div key={e.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>ID:</strong> {e.id}</div>
              <div><strong>Nombre:</strong> {e.nombre}</div>
              <div><strong>Teléfono:</strong> {e.telefono}</div>
              <div><strong>Correo:</strong> {e.correo}</div>
              <div><strong>Vencimiento:</strong> {e.vencimiento}</div>
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
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${
                closing ? "opacity-0" : "opacity-100"
              }`}
            ></div>

            <div
              className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${
                closing ? "animate-modal-out" : "animate-modal-in"
              }`}
            >
              <h2 className="text-xl font-bold mb-4">
                {empresaEdit.id ? "Editar Empresa" : "Nueva Empresa"}
              </h2>

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
                <label className="block mb-1 font-semibold">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={empresaEdit.correo}
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
                  className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors"
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
