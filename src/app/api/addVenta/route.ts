import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Cambia esto al módulo de conexión a tu base de datos

// Define y exporta la función POST para manejar solicitudes POST
export async function POST(request: Request) {
  // Extrae los datos del cuerpo de la solicitud
  const { cliente_rut, fecha_estimada, abono, fecha_venta } = await request.json();

  try {
    // Ejecuta la consulta en la base de datos
    const result = await pool.query(
        `INSERT INTO public.venta (cliente_rut, fecha_estimada, abono, fecha_venta) VALUES ($1, $2, $3, $4) RETURNING num_venta`,
        [cliente_rut, fecha_estimada, abono, fecha_venta]
    );
    
    // Devuelve una respuesta JSON con el ID de la venta creada
    return NextResponse.json({ num_venta: result.rows[0].num_venta });
  } catch (error) {
    console.error("Error al insertar en venta:", error);
    return NextResponse.json({ error: "Error al insertar en venta" }, { status: 500 });
  }
}
