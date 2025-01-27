"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../Landing/Navbar";

// Definir los tipos para los productos y la respuesta
interface Producto {
  nombre_producto: string;
  estado: string;
  fecha_estimada: string | null;
  fecha_entrega: string | null;
}

interface Result {
  productos: Producto[];
}

const Tracking = () => {
  const [rut, setRut] = useState("");
  const [pedido, setPedido] = useState("");
  const [result, setResult] = useState<Result | null>(null); // Definir el tipo de 'result'
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

      const data: Result = await response.json(); // Asegurarse de que el tipo sea 'Result'
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    }
  };

  const formatearRUT = (valor: string) => {
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();

    if (limpio.length > 1) {
      const cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const dv = limpio.slice(-1);
      return `${cuerpo}-${dv}`;
    }

    return limpio;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setRut(formatearRUT(input));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-gray-900">
      <Navbar />

      <main className="flex items-center justify-center flex-grow py-10 bg-cover bg-center">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/hero.png')", 
            filter: "blur(1px)",
            zIndex: -1
          }}
        ></div>

        <div className="container mx-auto px-4 flex items-center justify-center">
          <section className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/3 w-full flex items-center justify-center bg-[#393839] bg-[url('/diseño-horizontal.svg')] text-white p-6">
              <h2 className="text-2xl font-bold text-center">
                Seguimiento de Producto
              </h2>
            </div>

            <div className="lg:w-2/3 w-full p-4 sm:p-8 flex flex-col">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Rut"
                    name="rut"
                    value={rut}
                    onChange={handleRutChange}
                    required
                    className="min-w-[200px] p-3 bg-white rounded-lg shadow-md outline-none border border-gray-300 focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="N° de pedido"
                    name="pedido"
                    value={pedido}
                    onChange={(e) => setPedido(e.target.value)}
                    required
                    className="min-w-[200px] p-3 bg-white rounded-lg shadow-md outline-none border border-gray-300 focus:ring-2 focus:ring-orange-500"
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
              {result && result.productos && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
                  {result.productos.map((producto, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-gray-700">
                        <strong>Producto: </strong> {producto.nombre_producto}
                      </p>
                      <p className="text-gray-700">
                        <strong>Estado: </strong> 
                        {producto.estado === "Listo"
                          ? "Listo para su retiro"
                          : producto.estado}
                      </p>
                      {producto.estado === "Entregado" ? (
                        <p className="text-gray-700">
                          <strong>Fecha de entrega: </strong> {producto.fecha_entrega}
                        </p>
                      ) : producto.estado !== "Listo" && (
                        <p className="text-gray-700">
                          <strong>Fecha estimada :</strong> {producto.fecha_estimada}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-200 text-center py-4">
        <p className="text-gray-700 text-sm">
          &copy; 2025 Muebles EDSI. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Tracking;
