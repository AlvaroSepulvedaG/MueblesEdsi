"use client";

import { OrderForm } from "@/components/ui/Ventas/OrderForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NuevoOrden() {
  const searchParams = useSearchParams();
  const rut = searchParams.get("rut") || "";

  const [nombreCliente, setNombreCliente] = useState("");

  useEffect(() => {
    // Consulta a la API para obtener el nombre del cliente basado en el RUT
    const fetchNombreCliente = async () => {
      try {
        const response = await fetch(`/api/getClientes?rut=${rut}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setNombreCliente(data[0].nombres); // Asegúrate de que `nombres` sea el nombre del campo en tu BD
            console.log("Esto es", data[0].nombres);
          } else {
            console.error("Cliente no encontrado");
          }
        } else {
          console.error("Error al obtener el nombre del cliente");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    if (rut) {
      fetchNombreCliente();
    }
  }, [rut]);

  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold">Orden nueva</h3>
      <OrderForm cliente_rut={rut} nombres={nombreCliente} />
    </div>
  );
}
