import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function DispositivosEmpresa() {
  const [dispositivos, setDispositivos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dispositivoEdit, setDispositivoEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  const tipoLabels = {
    shelly_1: "Shelly 1",
    shelly_pro3m: "Shelly Pro 3M",
    otro: "Otro",
  };

  const [empresaId, setEmpresaId] = useState(null);

  useEffect(() => {
  const fetchDispositivos = async () => {
    try {
      // Obtener usuario guardado en localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.empresa_id) return;

      setEmpresaId(user.empresa_id);

      // Traer dispositivos de la empresa
      const { data, error } = await supabase
        .from("dispositivos")
        .select("*")
        .eq("empresa_id", user.empresa_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDispositivos(data || []);
    } catch (err) {
      console.error("Error cargando dispositivos:", err);
    }
  };

  fetchDispositivos();
}, []);

  const openModal = (dispositivo = null) => {
    setDispositivoEdit(
      dispositivo
        ? { ...dispositivo }
        : { id: null, nombre: "", tipo: "shelly_1", estado: true, empresa_id: empresaId }
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

  const handleSave = async () => {
    if (!dispositivoEdit.nombre || !dispositivoEdit.tipo) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const estadoBoolean = dispositivoEdit.estado === "activo" || dispositivoEdit.estado === true;

    if (dispositivoEdit.id) {
      // Actualizar dispositivo
      const { data, error } = await supabase
        .from("dispositivos")
        .update({
          nombre: dispositivoEdit.nombre,
          tipo: dispositivoEdit.tipo,
          estado: estadoBoolean,
        })
        .eq("id", dispositivoEdit.id)
        .select()
        .single();

      if (error) console.error("Error actualizando:", error);
      else {
        setDispositivos((prev) =>
          prev.map((d) => (d.id === data.id ? data : d))
        );
        closeModal();
      }
    } else {
      // Crear nuevo dispositivo
      const { data, error } = await supabase
        .from("dispositivos")
        .insert([
          {
            nombre: dispositivoEdit.nombre,
            tipo: dispositivoEdit.tipo,
            estado: estadoBoolean,
            empresa_id: empresaId,
          },
        ])
        .select()
        .single();

      if (error) console.error("Error insertando:", error);
      else {
        setDispositivos((prev) => [data, ...prev]);
        closeModal();
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Eliminar este dispositivo?")) {
      const { error } = await supabase
        .from("dispositivos")
        .delete()
        .eq("id", dispositivoEdit.id);

      if (error) console.error("Error eliminando:", error);
      else {
        setDispositivos(dispositivos.filter((d) => d.id !== dispositivoEdit.id));
        closeModal();
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Mis Dispositivos</h1>
          <div className="mt-3 md:mt-0 md:flex md:justify-end">
            <button
              onClick={() => openModal()}
              className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors"
            >
              Nuevo Dispositivo
            </button>
          </div>
        </div>

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">Nombre</th>
                <th className="border-b border-gray-300 p-2">Tipo</th>
                <th className="border-b border-gray-300 p-2">Estado</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dispositivos.map((d) => (
                <tr key={d.id}>
                  <td className="border-b border-gray-300 p-2">{d.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{tipoLabels[d.tipo] || d.tipo}</td>
                  <td className="border-b border-gray-300 p-2">{d.estado ? "Activo" : "Inactivo"}</td>
                  <td className="border-b border-gray-300 p-2">
                    <button
                      onClick={() => openModal(d)}
                      className="px-3 py-1 bg-[#a7c957] text-white rounded-full hover:bg-[#6a994e] transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-1 bg-[#bc4749] text-white rounded-full hover:bg-[#a63d3f] transition-colors ml-2"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="md:hidden flex flex-col gap-4">
          {dispositivos.map((d) => (
            <div key={d.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>Nombre:</strong> {d.nombre}</div>
              <div><strong>Tipo:</strong> {tipoLabels[d.tipo] || d.tipo}</div>
              <div><strong>Estado:</strong> {d.estado ? "Activo" : "Inactivo"}</div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => openModal(d)}
                  className="bg-[#a7c957] text-white px-3 py-1 rounded-full hover:bg-[#6a994e] transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-[#bc4749] text-white px-3 py-1 rounded-full hover:bg-[#a63d3f] transition-colors ml-2"
                >
                  Eliminar
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
                {dispositivoEdit?.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}
              </h2>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Nombre</label>
                <input
                  type="text"
                  value={dispositivoEdit.nombre}
                  onChange={(e) =>
                    setDispositivoEdit({ ...dispositivoEdit, nombre: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Tipo</label>
                <select
                  value={dispositivoEdit.tipo}
                  onChange={(e) =>
                    setDispositivoEdit({ ...dispositivoEdit, tipo: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="shelly_1">Shelly 1</option>
                  <option value="shelly_pro3m">Shelly Pro 3M</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Estado</label>
                <select
                  value={dispositivoEdit.estado ? "activo" : "inactivo"}
                  onChange={(e) =>
                    setDispositivoEdit({ ...dispositivoEdit, estado: e.target.value === "activo" })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                {dispositivoEdit?.id && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-full bg-[#bc4749] text-white hover:bg-[#a63d3f] transition-colors"
                  >
                    Eliminar
                  </button>
                )}
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
