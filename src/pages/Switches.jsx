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
      {
        numero: 1,
        ubicacion: "COOLER SUR",
        pinSensor: "A0",
        nombre: "COOLER SUR",
        tipo: "Pin ESP32",
      },
    ],
  },
  {
    id: 2,
    empresa: "Empresa Demo",
    dispositivo: "ESP32-002",
    ubicacion: "Sitio 2",
    paresPanel: 1,
    switchesIndividuales: [
      {
        numero: 1,
        ubicacion: "VENTILADOR NORTE",
        pinSensor: "A1",
        nombre: "VENTILADOR NORTE",
        tipo: "Pin ESP32",
      },
      {
        numero: 2,
        ubicacion: "LUZ SUR",
        pinSensor: "A2",
        nombre: "LUZ SUR",
        tipo: "Pin ESP32",
      },
    ],
  },
  {
    id: 3,
    empresa: "Empresa Demo",
    dispositivo: "ESP32-003",
    ubicacion: "Sitio 3",
    paresPanel: 0,
    switchesIndividuales: [
      {
        numero: 1,
        ubicacion: "BOMBA AGUA",
        pinSensor: "A3",
        nombre: "BOMBA AGUA",
        tipo: "Pin ESP32",
      },
    ],
  },
  {
    id: 4,
    empresa: "Empresa Demo",
    dispositivo: "ESP32-004",
    ubicacion: "Sitio 4",
    paresPanel: 2,
    switchesIndividuales: [
      {
        numero: 1,
        ubicacion: "COOLER ESTE",
        pinSensor: "A4",
        nombre: "COOLER ESTE",
        tipo: "Pin ESP32",
      },
      {
        numero: 2,
        ubicacion: "LUZ NORTE",
        pinSensor: "A5",
        nombre: "LUZ NORTE",
        tipo: "Pin ESP32",
      },
      {
        numero: 3,
        ubicacion: "VENTILADOR SUR",
        pinSensor: "A6",
        nombre: "VENTILADOR SUR",
        tipo: "Pin ESP32",
      },
    ],
  },
]);


  const [modalOpen, setModalOpen] = useState(false);
  const [switchEdit, setSwitchEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  const openModal = (sw) => {
    setSwitchEdit({ ...sw });
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
    setSwitchEdit({ ...switchEdit, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSwitches(
      switches.map((sw) => (sw.id === switchEdit.id ? switchEdit : sw))
    );
    closeModal();
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Switches</h1>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">ID</th>
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">ID Dispositivo</th>
                <th className="border-b border-gray-300 p-2">Ubicación</th>
                <th className="border-b border-gray-300 p-2">Pares Panel</th>
                <th className="border-b border-gray-300 p-2">Switches Individuales</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {switches.map((sw) => (
                <tr key={sw.id}>
                  <td className="border-b border-gray-300 p-2">{sw.id}</td>
                  <td className="border-b border-gray-300 p-2">{sw.empresa}</td>
                  <td className="border-b border-gray-300 p-2">{sw.dispositivo}</td>
                  <td className="border-b border-gray-300 p-2">{sw.ubicacion}</td>
                  <td className="border-b border-gray-300 p-2">{sw.paresPanel}</td>
                  <td className="border-b border-gray-300 p-2">
                    {sw.switchesIndividuales.map((swi) => (
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
              <h2 className="text-xl font-bold mb-4">Editar Switch</h2>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={switchEdit.empresa}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">ID Dispositivo</label>
                <input
                  type="text"
                  name="dispositivo"
                  value={switchEdit.dispositivo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={switchEdit.ubicacion}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Pares Panel</label>
                <input
                  type="number"
                  name="paresPanel"
                  value={switchEdit.paresPanel}
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
