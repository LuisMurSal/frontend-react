import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import ModalUsuarios from "../components/ModalUsuarios";

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

      // Traer usuarios con relación a empresas
      const { data: usuariosData, error: usuariosError } = await supabase
        .from("usuarios")
        .select(`
          id,
          nombre,
          email,
          role,
          empresa_id,
          empresa:empresas(nombre)
        `);

      if (usuariosError) console.error(usuariosError);
      else {
        if (user.role === "admin") setUsuarios(usuariosData);
        else if (user.role === "empresa") {
          setUsuarios(
            usuariosData.filter((u) => u.empresa_id === user.empresa_id)
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
        ? { ...user, empresa_id: user.empresa_id || "" }
        : { id: null, nombre: "", email: "", password: "", role: "usuario", empresa_id: "" }
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
  if (!usuarioEdit.nombre || !usuarioEdit.email || (!usuarioEdit.id && !usuarioEdit.password)) {
    alert("Completa todos los campos requeridos");
    return;
  }

  if (usuarioEdit.id) {
    // --- ACTUALIZAR usuario existente ---
    try {
      // Actualizar tabla 'usuarios'
      const { data, error } = await supabase
        .from("usuarios")
        .update({
          nombre: usuarioEdit.nombre,
          email: usuarioEdit.email,
          role: usuarioEdit.role,
          empresa_id: usuarioEdit.empresa_id || null,
        })
        .eq("id", usuarioEdit.id)
        .select(`*, empresa:empresas(nombre)`)
        .single();

      if (error) throw error;

      // Actualizar contraseña en Auth solo si se proporcionó
      if (usuarioEdit.password) {
        const res = await fetch(`http://localhost:5000/actualizar-usuario/${usuarioEdit.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: usuarioEdit.password }),
        });
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.error || "Error actualizando contraseña");
      }

      setUsuarios(usuarios.map((u) => (u.id === usuarioEdit.id ? data : u)));
      closeModal();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      alert(err.message || "Error actualizando usuario");
    }
  } else {
    // --- CREAR usuario nuevo mediante backend ---
    try {
      const payload = {
        nombre: usuarioEdit.nombre,
        email: usuarioEdit.email,
        role: usuarioEdit.role,
        empresa_id: usuarioEdit.empresa_id || null,
        password: usuarioEdit.password
      };

      const res = await fetch("http://localhost:5000/crear-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.user) throw new Error(data.error || "Error creando usuario");

      setUsuarios([...usuarios, data.user]);
      closeModal();
    } catch (err) {
      console.error("Error creando usuario:", err);
      alert(err.message || "Error creando usuario");
    }
  }
};


const handleDelete = async () => {
  if (!usuarioEdit?.id) return;

  if (!window.confirm("¿Eliminar este usuario?")) return;

  try {
    const res = await fetch(`http://localhost:5000/eliminar-usuario/${usuarioEdit.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error eliminando usuario");

    // Actualizar la tabla local
    setUsuarios(usuarios.filter((u) => u.id !== usuarioEdit.id));
    closeModal();
  } catch (err) {
    console.error("Error eliminando usuario:", err);
    alert(err.message || "Error eliminando usuario");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
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

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white p-4 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2">ID</th>
                <th className="border-b border-gray-300 p-2">Nombre</th>
                <th className="border-b border-gray-300 p-2">Email</th>
                <th className="border-b border-gray-300 p-2">Rol</th>
                <th className="border-b border-gray-300 p-2">Empresa</th>
                <th className="border-b border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="border-b border-gray-300 p-2">{u.id}</td>
                  <td className="border-b border-gray-300 p-2">{u.nombre}</td>
                  <td className="border-b border-gray-300 p-2">{u.email}</td>
                  <td className="border-b border-gray-300 p-2">{u.role}</td>
                  <td className="border-b border-gray-300 p-2">{u.empresa ? u.empresa.nombre : "-"}</td>
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

        {/* Cards mobile */}
        <div className="md:hidden flex flex-col gap-4">
          {usuarios.map((u) => (
            <div key={u.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
              <div><strong>ID:</strong> {u.id}</div>
              <div><strong>Nombre:</strong> {u.nombre}</div>
              <div><strong>Email:</strong> {u.email}</div>
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
          <ModalUsuarios
            usuarioEdit={usuarioEdit}
            handleChange={handleChange}
            closeModal={closeModal}
            handleSave={handleSave}
            handleDelete={handleDelete}
            empresas={empresas}
            closing={closing}
          />
        )}
      </main>
    </div>
  );
}
