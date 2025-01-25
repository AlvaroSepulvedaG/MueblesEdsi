"use client";

import { CompraForm } from "@/components/ui/Compras/CompraForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NuevaCompra() {
  const searchParams = useSearchParams();
  const proveedor_rut_proveedor = searchParams.get("rut_proveedor") || "";

  const [nombreProveedor, setNombreProveedor] = useState("");

  useEffect(() => {
    // Consulta a la API para obtener el nombre del cliente basado en el RUT
    const fetchNombreProveedor = async () => {
      try {
        const response = await fetch(`/api/getProveedor?rut_proveedor=${proveedor_rut_proveedor}`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setNombreProveedor(data[0].nombre_proveedor);
            console.log("Esto es", data[0].nombres);
          } else {
            console.error("Proveedor no encontrado");
          }
        } else {
          console.error("Error al obtener el nombre del proveedor");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    if (proveedor_rut_proveedor) {
      fetchNombreProveedor();
    }
  }, [proveedor_rut_proveedor]);

  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold">Compra nueva</h3>
      <CompraForm proveedor_rut_proveedor={proveedor_rut_proveedor} nombre_proveedor={nombreProveedor} />
    </div>
  );
}
