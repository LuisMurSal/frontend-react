import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Dispositivos() {
  const [dispositivos, setDispositivos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dispositivoEdit, setDispositivoEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  const tipoLabels = {
    shelly_1: "Shelly 1",
    shelly_pro3m: "Shelly Pro 3M",
    otro: "Otro",
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: empresasData } = await supabase
        .from("empresas")
        .select("id, nombre, correo");
      setEmpresas(empresasData || []);

      const { data: dispositivosData, error } = await supabase
        .from("dispositivos")
        .select(`
          id,
          nombre,
          tipo,
          estado,
          created_at,
          updated_at,
          empresa_id,
          empresas:empresa_id (nombre)
        `);

      if (error) console.error("Error cargando dispositivos:", error);
      else setDispositivos(dispositivosData || []);
    };

    fetchData();
  }, []);

  const openModal = (dispositivo = null) => {
    setDispositivoEdit(
      dispositivo
        ? { ...dispositivo, empresa_id: dispositivo.empresa_id?.toString() || "" }
        : { id: null, nombre: "", tipo: "shelly_1", estado: true, empresa_id: "" }
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
    if (!dispositivoEdit.nombre || !dispositivoEdit.tipo || !dispositivoEdit.empresa_id) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const estadoBoolean = dispositivoEdit.estado === "activo" || dispositivoEdit.estado === true;

    if (dispositivoEdit.id) {
      const { data, error } = await supabase
        .from("dispositivos")
        .update({
          nombre: dispositivoEdit.nombre,
          tipo: dispositivoEdit.tipo,
          estado: estadoBoolean,
          empresa_id: dispositivoEdit.empresa_id,
          updated_at: new Date(),
        })
        .eq("id", dispositivoEdit.id)
        .select(`
          id,
          nombre,
          tipo,
          estado,
          created_at,
          updated_at,
          empresa_id,
          empresas:empresa_id (nombre)
        `)
        .single();

      if (error) console.error("Error actualizando:", error);
      else {
        setDispositivos((prev) => prev.map((d) => (d.id === data.id ? data : d)));
        closeModal();
      }
    } else {
      const { data, error } = await supabase
        .from("dispositivos")
        .insert([{
          nombre: dispositivoEdit.nombre,
          tipo: dispositivoEdit.tipo,
          estado: estadoBoolean,
          empresa_id: dispositivoEdit.empresa_id,
        }])
        .select(`
          id,
          nombre,
          tipo,
          estado,
          created_at,
          updated_at,
          empresa_id,
          empresas:empresa_id (nombre)
        `)
        .single();

      if (error) console.error("Error insertando:", error);
      else {
        setDispositivos((prev) => [...prev, data]);
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
          <h1 className="text-3xl font-bold">Dispositivos</h1>
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
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dispositivos.map((d) => (
                <tr key={d.id}>
                  <td className="border-b border-gray-300 p-2">{d.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{tipoLabels[d.tipo] || d.tipo}</td>
                  <td className="border-b border-gray-300 p-2">{d.estado ? "Activo" : "Inactivo"}</td>
                  <td className="border-b border-gray-300 p-2">{d.empresas?.nombre || "Sin empresa"}</td>
                  <td className="border-b border-gray-300 p-2">
                    <button
                      onClick={() => openModal(d)}
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

        {/* Cards mobile */}
        <div className="md:hidden flex flex-col gap-4">
          {dispositivos.map((d) => (
            <div key={d.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>Nombre:</strong> {d.nombre}</div>
              <div><strong>Tipo:</strong> {tipoLabels[d.tipo] || d.tipo}</div>
              <div><strong>Estado:</strong> {d.estado ? "Activo" : "Inactivo"}</div>
              <div><strong>Empresa:</strong> {d.empresas?.nombre || "Sin empresa"}</div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => openModal(d)}
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
                {dispositivoEdit?.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}
              </h2>

              {/* Campos */}
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

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Empresa</label>
                <select
                  value={dispositivoEdit.empresa_id}
                  onChange={(e) =>
                    setDispositivoEdit({ ...dispositivoEdit, empresa_id: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecciona una empresa</option>
                  {empresas.map((e) => (
                    <option key={e.id} value={e.id.toString()}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones */}
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
