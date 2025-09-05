import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [closing, setClosing] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return navigate("/");

      const { data: usuariosData, error: usuariosError } = await supabase
        .from("usuarios")
        .select(`
          id,
          nombre,
          correo,
          role,
          empresa_id,
          empresa:empresas(nombre)
        `);

      if (usuariosError) console.error(usuariosError);
      else {
        if (user.role === "admin") setUsuarios(usuariosData);
        else if (user.role === "empresa") {
          setUsuarios(
            usuariosData.filter(u => u.empresa_id === user.empresa_id)
          );
        } else {
          setUsuarios([]);
        }
      }

      const { data: empresasData, error: empresasError } = await supabase
        .from("empresas")
        .select("*");
      if (empresasError) console.error(empresasError);
      else setEmpresas(empresasData);
    };

    fetchData();
  }, [navigate]);

  const openModal = (user = null) => {
    setUsuarioEdit(
      user
        ? { ...user, empresa_id: user.empresa_id || "", password: "" }
        : { id: null, nombre: "", correo: "", role: "cliente", empresa_id: "", password: "" }
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

  const handleChange = (e) =>
    setUsuarioEdit({ ...usuarioEdit, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (usuarioEdit.id) {
      // Editar usuario en tabla solo (no toca Auth)
      const { data, error } = await supabase
        .from("usuarios")
        .update({
          nombre: usuarioEdit.nombre,
          correo: usuarioEdit.correo,
          role: usuarioEdit.role,
          empresa_id: usuarioEdit.empresa_id || null,
        })
        .eq("id", usuarioEdit.id)
        .select(`
          *,
          empresa:empresas(nombre)
        `);
      if (error) console.error(error);
      else setUsuarios(usuarios.map(u => (u.id === usuarioEdit.id ? data[0] : u)));
    } else {
      // Crear usuario usando backend Node
      try {
        const res = await fetch("http://localhost:3000/crear-usuario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: usuarioEdit.nombre,
            correo: usuarioEdit.correo,
            password: usuarioEdit.password,
            role: usuarioEdit.role,
            empresa_id: usuarioEdit.empresa_id || null
          }),
        });

        const result = await res.json();

        if (res.ok) {
          setUsuarios([...usuarios, result.usuario]);
        } else {
          console.error(result.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
    closeModal();
  };

  const handleDelete = async () => {
    if (window.confirm("¿Eliminar este usuario?")) {
      const { error } = await supabase
        .from("usuarios")
        .delete()
        .eq("id", usuarioEdit.id);
      if (error) console.error(error);
      else setUsuarios(usuarios.filter(u => u.id !== usuarioEdit.id));
      closeModal();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className=" mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <div className="mt-3 md:mt-0 md:flex md:justify-end">
            <button
              onClick={() => openModal()}
              className="px-4 py-2 rounded-full bg-[#a7c957] text-white hover:bg-[#6a994e] transition-colors"
            >
              Nuevo Usuario
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
                <th className="border-b border-gray-300 p-2">Correo</th>
                <th className="border-b border-gray-300 p-2">Rol</th>
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td className="border-b border-gray-300 p-2">{u.id}</td>
                  <td className="border-b border-gray-300 p-2">{u.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{u.correo}</td>
                  <td className="border-b border-gray-300 p-2">{u.role}</td>
                  <td className="border-b border-gray-300 p-2">
                    {u.empresa ? u.empresa.nombre : "-"}
                  </td>
                  <td className="border-b border-gray-300 p-2">
                    <button
                      onClick={() => openModal(u)}
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
          {usuarios.map(u => (
            <div key={u.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>ID:</strong> {u.id}</div>
              <div><strong>Nombre:</strong> {u.nombre}</div>
              <div><strong>Correo:</strong> {u.correo}</div>
              <div><strong>Rol:</strong> {u.role}</div>
              <div><strong>Empresa:</strong> {u.empresa ? u.empresa.nombre : "-"}</div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => openModal(u)}
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
              <h2 className="text-xl font-bold mb-4">{usuarioEdit?.id ? "Editar Usuario" : "Nuevo Usuario"}</h2>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Nombre</label>
                <input type="text" name="nombre" value={usuarioEdit.nombre} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Correo</label>
                <input type="email" name="correo" value={usuarioEdit.correo} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Contraseña</label>
                <input type="password" name="password" value={usuarioEdit.password || ""} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Rol</label>
                <select name="role" value={usuarioEdit.role} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="admin">Admin</option>
                  <option value="empresa">Empresa</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-semibold">Empresa</label>
                <select name="empresa_id" value={usuarioEdit.empresa_id} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">- Ninguna -</option>
                  {empresas.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button onClick={closeModal} className="px-4 py-2 rounded-full border hover:bg-gray-100 transition-colors">Cancelar</button>
                {usuarioEdit?.id && (
                  <button onClick={handleDelete} className="px-4 py-2 rounded-full bg-[#bc4749] text-white hover:bg-[#a63d3f] transition-colors">Eliminar</button>
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
