import React from "react";

export default function ModalDispositivos({
  dispositivoEdit,
  setDispositivoEdit,
  closeModal,
  handleSave,
  handleDelete,
  closing,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo modal */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity ${
          closing ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* Contenido modal */}
      <div
        className={`relative bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg z-10 ${
          closing ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">
          {dispositivoEdit?.id ? "Editar Dispositivo" : "Nuevo Dispositivo"}
        </h2>

        {/* Nombre */}
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

        {/* Tipo */}
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

        {/* Tipo personalizado solo si es "otro" */}
        {dispositivoEdit.tipo === "otro" && (
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Tipo Personalizado</label>
            <input
              type="text"
              value={dispositivoEdit.tipo_personalizado || ""}
              onChange={(e) =>
                setDispositivoEdit({ ...dispositivoEdit, tipo_personalizado: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Ingrese nombre personalizado"
            />
          </div>
        )}

        {/* Estado */}
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
  );
}
