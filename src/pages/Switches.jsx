import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function Switches() {
  const [switches, setSwitches] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [switchEdit, setSwitchEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  // --- Fetch switches ---
  useEffect(() => {
    const fetchSwitches = async () => {
      const { data, error } = await supabase.from("switches").select("*");
      if (error) console.error("Error fetching switches:", error);
      else setSwitches(data);
    };
    fetchSwitches();
  }, []);

  // --- Fetch empresas ---
  useEffect(() => {
    const fetchEmpresas = async () => {
      const { data, error } = await supabase.from("empresas").select("*");
      if (error) console.error("Error fetching empresas:", error);
      else setEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  const openModal = (sw = null) => {
    setSwitchEdit(
      sw
        ? { ...sw }
        : { id: null, empresa_id: "", dispositivo: "", ubicacion: "", paresPanel: 0, switches_individuales: [] }
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
    const updated = { ...switchEdit, [e.target.name]: e.target.value };
    setSwitchEdit(updated);
  };

  const handleIndividualChange = (index, field, value) => {
    const updated = [...switchEdit.switches_individuales];
    updated[index][field] = value;
    const pares = Math.floor(updated.length / 2);
    setSwitchEdit({ ...switchEdit, switches_individuales: updated, paresPanel: pares });
  };

  const addIndividual = () => {
    const nextNum = switchEdit.switches_individuales.length
      ? Math.max(...switchEdit.switches_individuales.map(s => s.numero)) + 1
      : 1;
    const updatedIndividuals = [
      ...switchEdit.switches_individuales,
      { numero: nextNum, nombre: "", ubicacion: "", pinSensor: "", tipo: "" },
    ];
    const pares = Math.floor(updatedIndividuals.length / 2);
    setSwitchEdit({ ...switchEdit, switches_individuales: updatedIndividuals, paresPanel: pares });
  };

  const removeIndividual = (index) => {
    const updated = [...switchEdit.switches_individuales];
    updated.splice(index, 1);
    const pares = Math.floor(updated.length / 2);
    setSwitchEdit({ ...switchEdit, switches_individuales: updated, paresPanel: pares });
  };

  const handleSave = async () => {
    if (switchEdit.id) {
      // Editar switch
      const { data, error } = await supabase
        .from("switches")
        .update({
          empresa_id: switchEdit.empresa_id,
          dispositivo: switchEdit.dispositivo,
          ubicacion: switchEdit.ubicacion,
          paresPanel: switchEdit.paresPanel,
          switches_individuales: switchEdit.switches_individuales,
        })
        .eq("id", switchEdit.id)
        .select();
      if (error) console.error("Error updating switch:", error);
      else setSwitches(switches.map(s => (s.id === switchEdit.id ? data[0] : s)));
    } else {
      // Crear nuevo switch
      const { data, error } = await supabase
        .from("switches")
        .insert([{
          empresa_id: switchEdit.empresa_id,
          dispositivo: switchEdit.dispositivo,
          ubicacion: switchEdit.ubicacion,
          paresPanel: switchEdit.paresPanel,
          switches_individuales: switchEdit.switches_individuales,
        }])
        .select();
      if (error) console.error("Error creating switch:", error);
      else setSwitches([...switches, data[0]]);
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (!switchEdit?.id) return;
    const { error } = await supabase.from("switches").delete().eq("id", switchEdit.id);
    if (error) console.error("Error deleting switch:", error);
    else setSwitches(switches.filter(s => s.id !== switchEdit.id));
    closeModal();
  };

  // --- Helper para mostrar nombre de empresa ---
  const getEmpresaNombre = (empresa_id) => {
    const empresa = empresas.find(e => e.id === empresa_id);
    return empresa ? empresa.nombre : "Sin empresa";
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

        {/* Desktop Table */}
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
              {switches.map(sw => (
                <tr key={sw.id}>
                  <td className="border-b border-gray-300 p-2">{getEmpresaNombre(sw.empresa_id)}</td>
                  <td className="border-b border-gray-300 p-2">{sw.dispositivo}</td>
                  <td className="border-b border-gray-300 p-2">{sw.ubicacion}</td>
                  <td className="border-b border-gray-300 p-2">{sw.paresPanel}</td>
                  <td className="border-b border-gray-300 p-2">
                    {sw.switches_individuales.map(swi => (
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
          {switches.map(sw => (
            <div key={sw.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>Empresa:</strong> {getEmpresaNombre(sw.empresa_id)}</div>
              <div><strong>Dispositivo:</strong> {sw.dispositivo}</div>
              <div><strong>Ubicación:</strong> {sw.ubicacion}</div>
              <div><strong>Pares Panel:</strong> {sw.paresPanel}</div>
              <div>
                <strong>Switches Individuales:</strong>
                {sw.switches_individuales.map(swi => (
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
                {switchEdit?.id ? "Editar Switch" : "Nuevo Switch"}
              </h2>

              {/* Empresa select */}
              <div className="mb-3">
                <label className="block mb-1 font-semibold">Empresa</label>
                <select
                  name="empresa_id"
                  value={switchEdit.empresa_id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecciona una empresa</option>
                  {empresas.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Campos principales */}
              {["dispositivo", "ubicacion"].map(field => (
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
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={swi.nombre}
                      onChange={e => handleIndividualChange(index, "nombre", e.target.value)}
                      className="w-1/4 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Ubicación"
                      value={swi.ubicacion}
                      onChange={e => handleIndividualChange(index, "ubicacion", e.target.value)}
                      className="w-1/4 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Pin"
                      value={swi.pinSensor}
                      onChange={e => handleIndividualChange(index, "pinSensor", e.target.value)}
                      className="w-1/4 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Tipo"
                      value={swi.tipo}
                      onChange={e => handleIndividualChange(index, "tipo", e.target.value)}
                      className="w-1/4 p-2 border rounded"
                    />
                    <button
                      onClick={() => removeIndividual(index)}
                      className="px-2 py-1 bg-[#bc4749] text-white rounded hover:bg-[#A63D3F]"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={addIndividual}
                  className="px-4 py-2 bg-[#a7c957] text-white rounded hover:bg-[#6a994e]"
                >
                  + Agregar Individual
                </button>
              </div>

              {/* Botones modal */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                {switchEdit?.id && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-full bg-[#bc4749] text-white hover:bg-[#A63D3F] transition-colors"
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
