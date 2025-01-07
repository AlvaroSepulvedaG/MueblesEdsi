import { NextRequest, NextResponse } from "next/server"; // Para Next.js
import pool from "../../../lib/db"; // Asegúrate de que esta sea la referencia correcta a tu configuración de conexión

export async function GET(request: NextRequest) {
  try {
    // Consulta para obtener las comunas
    const result = await pool.query(
      "SELECT id_comuna, nombre_comuna FROM public.comuna"
    );

    // Responder con las filas obtenidas
    return new NextResponse(JSON.stringify(result.rows), { status: 200 });
  } catch (error: unknown) {
    console.error("Database error:", error);

    // Verificar si el error tiene la propiedad 'message'
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new NextResponse(
      JSON.stringify({ error: "Database error", details: errorMessage }),
      { status: 500 }
    );
  }
}
