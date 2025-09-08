import React from "react";

export default function ModalUsuarios({
  usuarioEdit,
  handleChange,
  closeModal,
  handleSave,
  handleDelete,
  empresas,
  closing,
}) {
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
          {usuarioEdit?.id ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        {/* Nombre */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuarioEdit.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={usuarioEdit.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Contraseña */}
<div className="mb-3">
  <label className="block mb-1 font-semibold">
    Contraseña
    {usuarioEdit?.id && " (dejar vacío si no quieres cambiarla)"}
  </label>
  <input
    type="password"
    name="password"
    value={usuarioEdit.password || ""}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>


        {/* Rol */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Rol</label>
          <select
            name="role"
            value={usuarioEdit.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="empresa">Empresa</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>

        {/* Empresa */}
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Empresa</label>
          <select
            name="empresa_id"
            value={usuarioEdit.empresa_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">- Ninguna -</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
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
          {usuarioEdit?.id && (
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
