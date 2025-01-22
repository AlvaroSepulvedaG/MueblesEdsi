"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const AboutMe = () => {
  const [rut, setRut] = useState("");

  const handleConsultar = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/seguimiento/simulacion.tsx?rut=${rut}`
      );
      if (!response.ok) {
        throw new Error("No se encontró el producto para este RUT");
      }
      const data = await response.json();
      alert(`Producto: ${data.producto}\nEstado: ${data.estado}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Encabezado */}
      <header className="bg-[#393839] text-white py-4 text-center flex justify-between items-center px-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo Muebles EDSI"
            width={50}
            height={50}
          />
        </Link>
        <h1 className="text-3xl font-bold">MUEBLES EDSI</h1>
        <Link
          href="/"
          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
        >
          Volver a Inicio
        </Link>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow flex items-center justify-center">
        <section className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col xl:flex-row">
          <div className="xl:w-1/3 lg:w-1/2 w-full flex items-center justify-center bg-[#393839] text-white p-6">
            <h2 className="text-2xl font-bold text-center">
              Seguimiento de Producto
            </h2>
          </div>

          <div className="xl:w-2/3 lg:w-1/2 w-full p-8 flex flex-col">
            <h3 className="text-center text-2xl font-semibold mb-6 text-gray-700">
              Consulta tu Pedido
            </h3>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleConsultar();
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Rut"
                  name="rut"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  required
                  className="p-3 bg-white rounded-lg shadow-md outline-none border border-gray-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-400"
              >
                Consultar
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4">
        <p className="text-gray-700 text-sm">
          &copy; 2025 Muebles EDSI. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default AboutMe;