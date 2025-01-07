import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Cambia esto al módulo de conexión a tu base de datos

// Define y exporta la función `POST` para manejar solicitudes POST
export async function POST(request: Request) {
  // Extrae los datos del cuerpo de la solicitud
  const { venta_num_venta, cantidad, producto_id_producto, precio, estado } = await request.json();

  try {
    // Ejecuta la consulta en la base de datos
    await pool.query(
      `INSERT INTO public.detalle_venta (venta_num_venta, cantidad, producto_id_producto, precio, estado) VALUES ($1, $2, $3, $4, $5)`,
      [venta_num_venta, cantidad, producto_id_producto, precio, estado]
    );

    // Devuelve una respuesta JSON confirmando el éxito de la operación
    return NextResponse.json({ message: "Detalle de venta guardado exitosamente" }, { status: 201 });
  } catch (error) {
    console.error("Error al insertar en detalle_venta:", error);
    return NextResponse.json({ error: "Error al insertar en detalle_venta" }, { status: 500 });
  }
}
