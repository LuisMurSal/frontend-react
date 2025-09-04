import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Switches() {
  const [switches, setSwitches] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [switchEdit, setSwitchEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  // --- Fetch inicial de switches y empresas ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: empresasData, error: empresasError } = await supabase
          .from("empresas")
          .select("*");
        if (empresasError) throw empresasError;
        setEmpresas(empresasData);

        const { data: switchesData, error: switchesError } = await supabase
          .from("switches")
          .select("*");
        if (switchesError) throw switchesError;

        // Asegurarse de que switches_individuales sea un array
        setSwitches(
          switchesData.map((s) => ({
            ...s,
            switches_individuales:
              typeof s.switches_individuales === "string"
                ? JSON.parse(s.switches_individuales)
                : s.switches_individuales || [],
          }))
        );
      } catch (err) {
        console.error("Error fetching data:", err.message);
      }
    };
    fetchData();
  }, []);

  // --- Modal ---
  const openModal = (sw = null) => {
    if (sw) {
      setSwitchEdit({
        ...sw,
        switches_individuales:
          typeof sw.switches_individuales === "string"
            ? JSON.parse(sw.switches_individuales)
            : sw.switches_individuales || [],
      });
    } else {
      setSwitchEdit({ id: null, empresa_id: "", dispositivo: "", ubicacion: "", switches_individuales: [] });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
    }, 200);
  };

  // --- Manejo de cambios ---
  const handleChange = (e) => {
    setSwitchEdit({ ...switchEdit, [e.target.name]: e.target.value });
  };

  const handleIndividualChange = (index, field, value) => {
    const updated = [...switchEdit.switches_individuales];
    updated[index][field] = value;
    setSwitchEdit({ ...switchEdit, switches_individuales: updated });
  };

  const addIndividual = () => {
    const nextNum = switchEdit.switches_individuales.length
      ? Math.max(...switchEdit.switches_individuales.map((s) => s.numero)) + 1
      : 1;
    setSwitchEdit({
      ...switchEdit,
      switches_individuales: [
        ...switchEdit.switches_individuales,
        { numero: nextNum, nombre: "", ubicacion: "", pinSensor: "", tipo: "" },
      ],
    });
  };

  const removeIndividual = (index) => {
    const updated = [...switchEdit.switches_individuales];
    updated.splice(index, 1);
    setSwitchEdit({ ...switchEdit, switches_individuales: updated });
  };

  // --- Guardar switch ---
  const handleSave = async () => {
    const paresPanel = Math.ceil(switchEdit.switches_individuales.length / 2);
    const payload = {
      empresa_id: switchEdit.empresa_id,
      dispositivo: switchEdit.dispositivo,
      ubicacion: switchEdit.ubicacion,
      paresPanel,
      switches_individuales: switchEdit.switches_individuales,
    };

    try {
      if (switchEdit.id) {
        // EDITAR
        const { data, error } = await supabase
          .from("switches")
          .update(payload)
          .eq("id", switchEdit.id)
          .select()
          .single();

        if (error) throw error;

        setSwitches((prev) => prev.map((s) => (s.id === switchEdit.id ? data : s)));
      } else {
        // CREAR
        const { data, error } = await supabase
          .from("switches")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        setSwitches((prev) => [...prev, data]);
      }
      closeModal();
    } catch (err) {
      console.error("Error guardando switch:", err.message);
    }
  };

  // --- Eliminar switch ---
  const handleDelete = async () => {
    if (!switchEdit?.id) return;

    try {
      const { error } = await supabase
        .from("switches")
        .delete()
        .eq("id", switchEdit.id);

      if (error) throw error;

      setSwitches((prev) => prev.filter((s) => s.id !== switchEdit.id));
      closeModal();
    } catch (err) {
      console.error("Error eliminando switch:", err.message);
    }
  };

  const getEmpresaNombre = (id) => {
    const emp = empresas.find((e) => e.id === id);
    return emp ? emp.nombre : "";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Switches</h1>
          <div className="mt-3 md:mt-0 md:flex md:justify-end">
            <button
              onClick={() => openModal(null)}
              className="px-4 py-2 bg-[#a7c957] text-white rounded-full hover:bg-[#6a994e] transition"
            >
              Nuevo Switch
            </button>
          </div>
        </div>

        {/* Tabla Desktop */}
        <div className="hidden md:block bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">Dispositivo</th>
                <th className="border-b border-gray-300 p-2">Ubicación</th>
                <th className="border-b border-gray-300 p-2">Pares Panel</th>
                <th className="border-b border-gray-300 p-2">Switches Individuales</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {switches.map((sw) => (
                <tr key={sw.id}>
                  <td className="border-b border-gray-300 p-2">{getEmpresaNombre(sw.empresa_id)}</td>
                  <td className="border-b border-gray-300 p-2">{sw.dispositivo}</td>
                  <td className="border-b border-gray-300 p-2">{sw.ubicacion}</td>
                  <td className="border-b border-gray-300 p-2">{Math.ceil(sw.switches_individuales.length / 2)}</td>
                  <td className="border-b border-gray-300 p-2">
                    {sw.switches_individuales.map((swi) => (
                      <div key={swi.numero} className="mb-1">
                        <strong>#{swi.numero}</strong> - {swi.nombre} ({swi.tipo})
                      </div>
                    ))}
                  </td>
                  <td className="border-b border-gray-300 p-2">
                    <button
                      onClick={() => openModal(sw)}
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
          {switches.map((sw) => (
            <div key={sw.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>Empresa:</strong> {getEmpresaNombre(sw.empresa_id)}</div>
              <div><strong>Dispositivo:</strong> {sw.dispositivo}</div>
              <div><strong>Ubicación:</strong> {sw.ubicacion}</div>
              <div><strong>Pares Panel:</strong> {Math.ceil(sw.switches_individuales.length / 2)}</div>
              <div>
                <strong>Switches Individuales:</strong>
                {sw.switches_individuales.map((swi) => (
                  <div key={swi.numero} className="ml-2">
                    #{swi.numero} - {swi.nombre} ({swi.tipo})
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => openModal(sw)}
                  className="bg-[#a7c957] text-white px-3 py-1 rounded-full hover:bg-[#6a994e] transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && switchEdit && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${closing ? "opacity-0" : "opacity-100"}`}
            ></div>

            <div
              className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${closing ? "animate-modal-out" : "animate-modal-in"}`}
            >
              <h2 className="text-xl font-bold mb-4">{switchEdit.id ? "Editar Switch" : "Nuevo Switch"}</h2>

              {/* Empresa */}
              <div className="mb-3">
                <label className="block mb-1 font-semibold">Empresa</label>
                <select
                  name="empresa_id"
                  value={switchEdit.empresa_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecciona empresa</option>
                  {empresas.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Campos */}
              {["dispositivo", "ubicacion"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="block mb-1 font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={switchEdit[field]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}

              {/* Switches individuales */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Switches Individuales</h3>
                {switchEdit.switches_individuales.map((swi, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Nombre" value={swi.nombre} onChange={(e) => handleIndividualChange(index, "nombre", e.target.value)} className="w-1/4 p-2 border rounded" />
                    <input type="text" placeholder="Ubicación" value={swi.ubicacion} onChange={(e) => handleIndividualChange(index, "ubicacion", e.target.value)} className="w-1/4 p-2 border rounded" />
                    <input type="text" placeholder="Pin" value={swi.pinSensor} onChange={(e) => handleIndividualChange(index, "pinSensor", e.target.value)} className="w-1/4 p-2 border rounded" />
                    <input type="text" placeholder="Tipo" value={swi.tipo} onChange={(e) => handleIndividualChange(index, "tipo", e.target.value)} className="w-1/4 p-2 border rounded" />
                    <button onClick={() => removeIndividual(index)} className="px-2 py-1 bg-[#bc4749] text-white rounded hover:bg-[#A63D3F]">X</button>
                  </div>
                ))}
                <button onClick={addIndividual} className="px-4 py-2 bg-[#a7c957] text-white rounded hover:bg-[#6a994e]">+ Agregar Individual</button>
              </div>

              {/* Botones modal */}
              <div className="flex justify-end space-x-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors">Cancelar</button>
                {switchEdit?.id && (
                  <button onClick={handleDelete} className="px-4 py-2 rounded-full bg-[#bc4749] text-white hover:bg-[#A63D3F] transition-colors">Eliminar</button>
                )}
                <button onClick={handleSave} className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
