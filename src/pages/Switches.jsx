import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import ModalSwitches from "../components/ModalSwitches";

export default function Switches() {
  const [switches, setSwitches] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [switchEdit, setSwitchEdit] = useState(null);

  // --- Fetch inicial ---
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
      setSwitchEdit({
        id: null,
        empresa_id: "",
        dispositivo: "",
        ubicacion: "",
        encendido: false,
        switches_individuales: [],
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSave = (updatedSwitch) => {
    setSwitches((prev) => {
      if (updatedSwitch.id) {
        return prev.map((s) => (s.id === updatedSwitch.id ? updatedSwitch : s));
      } else {
        return [...prev, updatedSwitch];
      }
    });
    closeModal();
  };

  const handleDelete = (id) => {
    setSwitches((prev) => prev.filter((s) => s.id !== id));
    closeModal();
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
                <th className="border-b border-gray-300 p-2">Estado</th>
                <th className="border-b border-gray-300 p-2">Pares Panel</th>
                <th className="border-b border-gray-300 p-2">Switches Individuales</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {switches.map((sw) => {
                const paresPanel = sw.switches_individuales.filter(s => s.tipo === "par");
                const individuales = sw.switches_individuales.filter(s => s.tipo === "individual");

                return (
                  <tr key={sw.id}>
                    <td className="border-b border-gray-300 p-2">{getEmpresaNombre(sw.empresa_id)}</td>
                    <td className="border-b border-gray-300 p-2">{sw.dispositivo}</td>
                    <td className="border-b border-gray-300 p-2">{sw.ubicacion}</td>
                    <td className="border-b border-gray-300 p-2">
                      {sw.encendido ? (
                        <span className="text-green-600 font-bold">Encendido</span>
                      ) : (
                        <span className="text-[#bc4749] font-bold">Apagado</span>
                      )}
                    </td>
                    <td className="border-b border-gray-300 p-2">
                      {paresPanel.map((p, i) => (
                        <div key={i}>
                          Switch 1 - {p.nombre1} / Switch 2 - {p.nombre2}
                        </div>
                      ))}
                    </td>
                    <td className="border-b border-gray-300 p-2">
                      {individuales.map((swi) => (
                        <div key={swi.numero} className="mb-1">
                          #{swi.numero} - {swi.nombre} ({swi.tipo})
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {switches.map((sw) => {
            const paresPanel = sw.switches_individuales.filter(s => s.tipo === "par");
            const individuales = sw.switches_individuales.filter(s => s.tipo === "individual");

            return (
              <div key={sw.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
                <div><strong>Empresa:</strong> {getEmpresaNombre(sw.empresa_id)}</div>
                <div><strong>Dispositivo:</strong> {sw.dispositivo}</div>
                <div><strong>Ubicación:</strong> {sw.ubicacion}</div>
                <div><strong>Estado:</strong> {sw.encendido ? "Encendido ✅" : "Apagado ❌"}</div>
                <div>
                  <strong>Pares Panel:</strong>
                  {paresPanel.map((p, i) => (
                    <div key={i}>
                      Switch 1 - {p.nombre1} / Switch 2 - {p.nombre2}
                    </div>
                  ))}
                </div>
                <div>
                  <strong>Switches Individuales:</strong>
                  {individuales.map((swi) => (
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
            );
          })}
        </div>

        {/* Modal */}
        <ModalSwitches
          isOpen={modalOpen}
          switchEdit={switchEdit}
          empresas={empresas}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
