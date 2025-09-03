import React, { useState } from "react";

export default function Dispositivos() {
  const [dispositivos, setDispositivos] = useState([
    {
      id: 1,
      nombre: "Dispositivo 1",
      shellyId: "SH-001",
      authKey: "abc123",
      tipo: "Shelly 1",
      servidos: 2,
      empresa: "AgroTech S.A.",
      vencimiento: "2025-12-31",
    },
    {
      id: 2,
      nombre: "Dispositivo 2",
      shellyId: "SH-002",
      authKey: "def456",
      tipo: "Shelly 2.5",
      servidos: 3,
      empresa: "GreenFields",
      vencimiento: "2025-11-30",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [dispositivoEdit, setDispositivoEdit] = useState(null);
  const [closing, setClosing] = useState(false);

  const openModal = (dispositivo = null) => {
    setDispositivoEdit(
      dispositivo
        ? { ...dispositivo }
        : {
            id: null,
            nombre: "",
            shellyId: "",
            authKey: "",
            tipo: "",
            servidos: 0,
            empresa: "",
            vencimiento: "",
          }
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
    const { name, value } = e.target;
    setDispositivoEdit({ ...dispositivoEdit, [name]: value });
  };

  const handleSave = () => {
    if (dispositivoEdit.id) {
      setDispositivos(
        dispositivos.map((d) =>
          d.id === dispositivoEdit.id ? dispositivoEdit : d
        )
      );
    } else {
      const newDispositivo = {
        ...dispositivoEdit,
        id: dispositivos.length ? Math.max(...dispositivos.map(d => d.id)) + 1 : 1,
      };
      setDispositivos([...dispositivos, newDispositivo]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (window.confirm("¿Eliminar este dispositivo?")) {
      setDispositivos(dispositivos.filter(d => d.id !== dispositivoEdit.id));
      closeModal();
    }
  };

  return (
    <div className="flex min-h-screen">
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

        {/* Desktop Table */}
        <div className="hidden md:block bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">ID</th>
                <th className="border-b border-gray-300 p-2">Nombre</th>
                <th className="border-b border-gray-300 p-2">Shelly ID</th>
                <th className="border-b border-gray-300 p-2">Auth Key</th>
                <th className="border-b border-gray-300 p-2">Tipo</th>
                <th className="border-b border-gray-300 p-2">Servidos</th>
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">Vencimiento</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dispositivos.map((d) => (
                <tr key={d.id}>
                  <td className="border-b border-gray-300 p-2">{d.id}</td>
                  <td className="border-b border-gray-300 p-2">{d.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{d.shellyId}</td>
                  <td className="border-b border-gray-300 p-2">{d.authKey}</td>
                  <td className="border-b border-gray-300 p-2">{d.tipo}</td>
                  <td className="border-b border-gray-300 p-2">{d.servidos}</td>
                  <td className="border-b border-gray-300 p-2">{d.empresa}</td>
                  <td className="border-b border-gray-300 p-2">{d.vencimiento}</td>
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

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {dispositivos.map((d) => (
            <div key={d.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>ID:</strong> {d.id}</div>
              <div><strong>Nombre:</strong> {d.nombre}</div>
              <div><strong>Shelly ID:</strong> {d.shellyId}</div>
              <div><strong>Auth Key:</strong> {d.authKey}</div>
              <div><strong>Tipo:</strong> {d.tipo}</div>
              <div><strong>Servidos:</strong> {d.servidos}</div>
              <div><strong>Empresa:</strong> {d.empresa}</div>
              <div><strong>Vencimiento:</strong> {d.vencimiento}</div>
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
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${closing ? "opacity-0" : "opacity-100"}`}></div>

            <div className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${closing ? "animate-modal-out" : "animate-modal-in"}`}>
              <h2 className="text-xl font-bold mb-4">
                {dispositivoEdit?.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}
              </h2>

              {[
                { label: "Nombre", name: "nombre", type: "text" },
                { label: "Shelly ID", name: "shellyId", type: "text" },
                { label: "Auth Key", name: "authKey", type: "text" },
                { label: "Tipo", name: "tipo", type: "text" },
                { label: "Servidos", name: "servidos", type: "number" },
                { label: "Empresa", name: "empresa", type: "text" },
                { label: "Vencimiento", name: "vencimiento", type: "date" },
              ].map((field) => (
                <div className="mb-3" key={field.name}>
                  <label className="block mb-1 font-semibold">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={dispositivoEdit[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors">
                  Cancelar
                </button>
                {dispositivoEdit?.id && (
                  <button onClick={handleDelete} className="px-4 py-2 rounded-full bg-[#bc4749] text-white hover:bg-[#a63d3f] transition-colors">
                    Eliminar
                  </button>
                )}
                <button onClick={handleSave} className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors">
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
