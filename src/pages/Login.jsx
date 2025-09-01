import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo_tele.webp";
import Slide1 from "../assets/images/slide1.webp";
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();

  const users = [
    { email: "admin@correo.com", password: "123456", role: "admin" },
    { email: "cliente@correo.com", password: "123456", role: "cliente" },
    { email: "empresa@correo.com", password: "123456", role: "empresa" },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      setError("Correo o contraseña incorrectos");
      return;
    }
    if (user.role === "admin") navigate("/dashboard-admin");
    if (user.role === "cliente") navigate("/dashboard-cliente");
    if (user.role === "empresa") navigate("/dashboard-empresa");
  };

  return (
  <div className="flex flex-col min-h-screen">
    {/* Contenedor principal: login + lado izquierdo */}
    <div className="flex flex-1">
      {/* Lado izquierdo: rosa pastel (oculto en móviles) */}
      <div className="hidden md:flex w-7/12 items-center justify-center">
        <img
          src={Slide1}
          alt="Slide 1"
          className="max-w-[100%] max-h-[90%] object-cover rounded-3xl shadow-lg"
        />
      </div>

      {/* Lado derecho: formulario */}
      <div className="flex-1 flex items-center justify-center bg-[#f2e8cf]">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-3xl p-6 w-11/12 max-w-md flex flex-col items-center"
        >
          <img src={Logo} alt="Logo Tele" className="w-48 h-48 object-contain mb-6" />

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a7c957]"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#a7c957]"
            required
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <p className="my-2 text-sm text-[#6a994e] self-end">
            ¿Olvidaste tu contraseña?
          </p>

          <button
            type="submit"
            className="w-full bg-[#a7c957] text-white p-4 rounded-full font-semibold hover:bg-[#6a994e] transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>

    {/* Footer */}
    <Footer />
  </div>
);

}
