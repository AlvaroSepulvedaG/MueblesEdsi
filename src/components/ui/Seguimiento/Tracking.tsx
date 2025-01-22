"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../Landing/Navbar";

const Tracking = () => {
  const [rut, setRut] = useState("");
  const [pedido, setPedido] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleConsultar = async () => {
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/seguimiento?rut=${rut.replace(/[^0-9kK]/g, '')}&pedido=${pedido}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error desconocido");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatearRUT = (valor) => {
    // Elimina caracteres no válidos
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();

    // Aplica formato si tiene más de un carácter
    if (limpio.length > 1) {
      const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const dv = limpio.slice(-1);
      return `${cuerpo}-${dv}`;
    }

    return limpio; // Devuelve el valor limpio si es corto
  };

  const handleRutChange = (e) => {
    const input = e.target.value;
    setRut(formatearRUT(input));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-gray-900">
      {/* Encabezado */}
      <Navbar />

      {/* Contenido Principal */}
      <main
        className="flex items-center justify-center flex-grow py-10 bg-cover bg-center"
        
      >
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/hero.png')", 
            filter: "blur(1px)",
            zIndex: -1
          }}
        ></div>

        <section className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col xl:flex-row">
          <div className="xl:w-1/3 lg:w-1/2 w-full flex items-center justify-center bg-[#393839] bg-[url('/diseño-horizontal.svg')] text-white p-6">
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
                  onChange={handleRutChange}
                  required
                  className="p-3 bg-white rounded-lg shadow-md outline-none border border-gray-300 focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="N° de pedido"
                  name="pedido"
                  value={pedido}
                  onChange={(e) => setPedido(e.target.value)}
                  required
                  className="p-3 bg-white rounded-lg shadow-md outline-none border border-gray-300 focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition-transform transform hover:scale-105"
              >
                Consultar
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
            {result && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
                <p className="text-gray-700">
                  <strong>Fecha estimada:</strong> {result.fecha_estimada}
                </p>
                <p className="text-gray-700">
                  <strong>Estado:</strong> {result.estado}
                </p>
              </div>
            )}
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

export default Tracking;
