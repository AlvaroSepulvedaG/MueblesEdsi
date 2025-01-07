import { NextRequest, NextResponse } from "next/server"; // Si usas Next.js
import pool from "../../../lib/db";

export async function GET(request: NextRequest) {
  const headers = new Headers({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
  });
  try {
    const { searchParams } = new URL(request.url);
    const rut = searchParams.get("rut");

    let query: string;
    let values: string[] | undefined;

    if (rut) {
      // Si hay un 'rut', construir la consulta con parámetros
      query = "SELECT * FROM public.cliente WHERE rut = $1 ORDER BY rut DESC";
      values = [rut];
    } else {
      // Si no hay un 'rut', construir la consulta sin parámetros
      query = "SELECT * FROM cliente ORDER BY rut DESC";
      values = undefined; // No pasaremos valores en este caso
    }

    // Ejecutar la consulta con o sin parámetros según corresponda
    const result = values
      ? await pool.query(query, values) // Con parámetros
      : await pool.query(query); // Sin parámetros

    // Responder con los resultados
    return new NextResponse(JSON.stringify(result.rows), { status: 200, headers });
  } catch (error: unknown) {
    console.error("Database error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(
      JSON.stringify({ error: "Database error", details: errorMessage }),
      { status: 500 }
    );
  }
}
