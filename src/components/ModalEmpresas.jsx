import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function ModalEmpresas({ empresa, isOpen, onClose, onSave }) {
  const [empresaEdit, setEmpresaEdit] = useState(empresa || {
    id: null,
    nombre: "",
    telefono: "",
    correo: "",
    vencimiento: "",
  });
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (empresa) setEmpresaEdit(empresa);
    else
      setEmpresaEdit({
        id: null,
        nombre: "",
        telefono: "",
        correo: "",
        vencimiento: "",
      });
  }, [empresa]);

  const handleChange = (e) => {
    setEmpresaEdit({ ...empresaEdit, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (onSave) await onSave(empresaEdit);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      if (onClose) onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
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
          {empresaEdit.id ? "Editar Empresa" : "Nueva Empresa"}
        </h2>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={empresaEdit.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={empresaEdit.telefono}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Correo</label>
          <input
            type="email"
            name="correo"
            value={empresaEdit.correo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Vencimiento</label>
          <input
            type="date"
            name="vencimiento"
            value={empresaEdit.vencimiento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          {empresaEdit.id && (
            <button
              onClick={async () => {
                if (
                  window.confirm("¿Seguro quieres eliminar esta empresa?")
                ) {
                  try {
                    const { error } = await supabase
                      .from("empresas")
                      .delete()
                      .eq("id", empresaEdit.id);
                    if (error) throw error;
                    if (onSave) onSave(null, empresaEdit.id); // eliminar
                    handleClose();
                  } catch (err) {
                    console.error("Error eliminando empresa:", err);
                  }
                }
              }}
              className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
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
