import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import Logo from "../assets/images/logo_tele.webp";
import Slide1 from "../assets/images/slide1.webp";
import Slide2 from "../assets/images/slide2.webp";
import Slide3 from "../assets/images/slide3.webp";
import Slide4 from "../assets/images/slide4.webp";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- Slideshow con fade ---
  const slides = [Slide1, Slide2, Slide3, Slide4];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData.user) {
        setError("Correo o contraseña incorrectos");
        return;
      }

      // 2️⃣ Obtener datos completos del usuario desde la tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError || !userData) {
        setError("Usuario no encontrado en la base de datos");
        return;
      }

      // 3️⃣ Guardar info en localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // 4️⃣ Redirigir según rol
      switch (userData.role) {
        case "admin":
          navigate("/dashboard-admin");
          break;
        case "empresa":
          navigate("/dashboard-empresa");
          break;
        case "cliente":
          navigate("/dashboard-cliente");
          break;
        default:
          setError("Rol desconocido");
      }
    } catch (err) {
      console.log(err);
      setError("Ocurrió un error, intenta de nuevo");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* Lado izquierdo: slideshow */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-5000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
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

            <p className="my-2 text-sm text-[#6a994e] self-end">¿Olvidaste tu contraseña?</p>

            <button
              type="submit"
              className="w-full bg-[#a7c957] text-white p-4 rounded-full font-semibold hover:bg-[#6a994e] transition-colors"
            >
              Ingresar
            </button>

            <p className="my-2 text-sm text-[#6a994e]">
              © 2025 Pulso agrícola. Todos los derechos reservados.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
