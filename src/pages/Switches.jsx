import React, { useState } from "react";

export default function Switches() {
  const [switches, setSwitches] = useState([
    {
      id: 1,
      empresa: "Empresa Demo",
      dispositivo: "ESP32-001",
      ubicacion: "Sitio 1",
      paresPanel: 0,
      switchesIndividuales: [
        { numero: 1, ubicacion: "COOLER SUR", pinSensor: "A0", nombre: "COOLER SUR", tipo: "Pin ESP32" },
      ],
    },
    {
      id: 2,
      empresa: "Empresa Demo",
      dispositivo: "ESP32-002",
      ubicacion: "Sitio 2",
      paresPanel: 1,
      switchesIndividuales: [
        { numero: 1, ubicacion: "VENTILADOR NORTE", pinSensor: "A1", nombre: "VENTILADOR NORTE", tipo: "Pin ESP32" },
        { numero: 2, ubicacion: "LUZ SUR", pinSensor: "A2", nombre: "LUZ SUR", tipo: "Pin ESP32" },
      ],
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [switchEdit, setSwitchEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  const openModal = (sw = null) => {
    setSwitchEdit(sw ? { ...sw } : { empresa: "", dispositivo: "", ubicacion: "", paresPanel: 0, switchesIndividuales: [] });
    setModalOpen(true);
  };

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
    }, 200);
  };

  const handleChange = (e) => setSwitchEdit({ ...switchEdit, [e.target.name]: e.target.value });

  const handleIndividualChange = (index, field, value) => {
    const updated = [...switchEdit.switchesIndividuales];
    updated[index][field] = value;
    setSwitchEdit({ ...switchEdit, switchesIndividuales: updated });
  };

  const addIndividual = () => {
    const nextNum = switchEdit.switchesIndividuales.length
      ? Math.max(...switchEdit.switchesIndividuales.map(s => s.numero)) + 1
      : 1;
    setSwitchEdit({
      ...switchEdit,
      switchesIndividuales: [
        ...switchEdit.switchesIndividuales,
        { numero: nextNum, nombre: "", ubicacion: "", pinSensor: "", tipo: "" },
      ],
    });
  };

  const removeIndividual = (index) => {
    const updated = [...switchEdit.switchesIndividuales];
    updated.splice(index, 1);
    setSwitchEdit({ ...switchEdit, switchesIndividuales: updated });
  };

  const handleSave = () => {
    if (switchEdit.id) {
      setSwitches(switches.map(sw => (sw.id === switchEdit.id ? switchEdit : sw)));
    } else {
      const newSwitch = { ...switchEdit, id: switches.length ? Math.max(...switches.map(s => s.id)) + 1 : 1 };
      setSwitches([...switches, newSwitch]);
    }
    closeModal();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Switches</h1>
          <div className="mt-3 md:mt-0 md:flex md:justify-end">
            <button
              onClick={() => openModal()}
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
                <th className="border-b border-gray-300 p-2">ID</th>
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
                  <td className="border-b border-gray-300 p-2">{sw.id}</td>
                  <td className="border-b border-gray-300 p-2">{sw.empresa}</td>
                  <td className="border-b border-gray-300 p-2">{sw.dispositivo}</td>
                  <td className="border-b border-gray-300 p-2">{sw.ubicacion}</td>
                  <td className="border-b border-gray-300 p-2">{sw.paresPanel}</td>
                  <td className="border-b border-gray-300 p-2">
                    {sw.switchesIndividuales.map(swi => (
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
              <div><strong>ID:</strong> {sw.id}</div>
              <div><strong>Empresa:</strong> {sw.empresa}</div>
              <div><strong>Dispositivo:</strong> {sw.dispositivo}</div>
              <div><strong>Ubicación:</strong> {sw.ubicacion}</div>
              <div><strong>Pares Panel:</strong> {sw.paresPanel}</div>
              <div>
                <strong>Switches Individuales:</strong>
                {sw.switchesIndividuales.map(swi => (
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
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${closing ? "opacity-0" : "opacity-100"}`}></div>

            <div className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${closing ? "animate-modal-out" : "animate-modal-in"}`}>
              <h2 className="text-xl font-bold mb-4">{switchEdit?.id ? "Editar Switch" : "Nuevo Switch"}</h2>

              {["empresa", "dispositivo", "ubicacion", "paresPanel"].map(field => (
                <div className="mb-3" key={field}>
                  <label className="block mb-1 font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === "paresPanel" ? "number" : "text"}
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
                {switchEdit.switchesIndividuales.map((swi, index) => (
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

              <div className="flex justify-end space-x-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-full border hover:bg-gray-100">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e]">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

