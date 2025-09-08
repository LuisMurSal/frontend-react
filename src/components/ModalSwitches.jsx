import React, { useState, useEffect } from "react";

export default function ModalSwitches({ isOpen, onClose, switchEdit, empresas, onSave, onDelete }) {
  const [form, setForm] = useState({
    id: null,
    empresa_id: "",
    dispositivo: "",
    ubicacion: "",
    encendido: false,
    switches_individuales: [],
  });

  useEffect(() => {
    if (switchEdit) setForm(switchEdit);
  }, [switchEdit]);

  // --- Cambios generales ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --- Añadir Individual ---
  const handleAddIndividual = () => {
    const nextNumber = form.switches_individuales.length + 1;
    setForm((prev) => ({
      ...prev,
      switches_individuales: [
        ...prev.switches_individuales,
        { numero: nextNumber, nombre: "", tipo: "individual" },
      ],
    }));
  };

  // --- Añadir Par ---
  const handleAddPar = () => {
    const nextNumber = form.switches_individuales.length + 1;
    setForm((prev) => ({
      ...prev,
      switches_individuales: [
        ...prev.switches_individuales,
        { numero: nextNumber, nombre1: "", nombre2: "", tipo: "par" },
      ],
    }));
  };

  // --- Cambios por switch ---
  const handleSwitchChange = (index, field, value) => {
    const newSwitches = [...form.switches_individuales];
    newSwitches[index][field] = value;
    setForm((prev) => ({ ...prev, switches_individuales: newSwitches }));
  };

  // --- Eliminar switch ---
  const handleDeleteSwitch = (index) => {
    const newSwitches = [...form.switches_individuales];
    newSwitches.splice(index, 1);
    // Reenumerar automáticamente
    const renumbered = newSwitches.map((swi, i) => ({ ...swi, numero: i + 1 }));
    setForm((prev) => ({ ...prev, switches_individuales: renumbered }));
  };

  // --- Guardar ---
  const handleSubmit = () => {
    onSave(form);
  };

  // --- Eliminar completo ---
  const handleDelete = () => {
    if (form.id) onDelete(form.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">{form.id ? "Editar Switch" : "Nuevo Switch"}</h2>

        {/* Empresa */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Empresa</label>
          <select
            name="empresa_id"
            value={form.empresa_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Seleccione una empresa</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        {/* Dispositivo */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Dispositivo</label>
          <input
            type="text"
            name="dispositivo"
            value={form.dispositivo}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Ubicación */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Estado */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="encendido"
            checked={form.encendido}
            onChange={handleChange}
          />
          <label>Encendido</label>
        </div>

        {/* Switches */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Switches</h3>
          {form.switches_individuales.map((swi, i) => (
            <div key={i} className="border p-2 mb-2 rounded flex flex-col gap-2">
              {swi.tipo === "individual" ? (
                <div>
                  <label className="font-semibold">#{swi.numero} Nombre</label>
                  <input
                    type="text"
                    value={swi.nombre}
                    onChange={(e) => handleSwitchChange(i, "nombre", e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-semibold">#{swi.numero} Switch 1</label>
                    <input
                      type="text"
                      value={swi.nombre1}
                      onChange={(e) => handleSwitchChange(i, "nombre1", e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">#{swi.numero + 1} Switch 2</label>
                    <input
                      type="text"
                      value={swi.nombre2}
                      onChange={(e) => handleSwitchChange(i, "nombre2", e.target.value)}
                      className="border p-1 rounded w-full"
                    />
                  </div>
                </>
              )}
              <button
                onClick={() => handleDeleteSwitch(i)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-1"
              >
                Eliminar
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <button
              onClick={handleAddIndividual}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Añadir Individual
            </button>
            <button
              onClick={handleAddPar}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Añadir Par
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          {form.id && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#a7c957] text-white px-4 py-2 rounded hover:bg-[#6a994e]"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
