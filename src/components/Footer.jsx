// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-white text-[#6a994e] py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        {/* Texto centrado */}
        <p className="text-sm text-center">
          &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
