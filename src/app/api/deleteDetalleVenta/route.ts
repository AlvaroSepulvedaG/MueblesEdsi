// src/app/api/deleteDetalleVenta/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { id_detalle_venta } = await req.json();

    // Verificar si el `id_detalle_venta` fue proporcionado
    if (!id_detalle_venta) {
      return NextResponse.json(
        { error: "El ID del detalle de venta es obligatorio" },
        { status: 400 }
      );
    }

    const query = `
      DELETE FROM public.detalle_venta
      WHERE id_detalle_venta = $1
    `;
    const values = [id_detalle_venta];

    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    // Deshabilitar caché para este endpoint
    const response = NextResponse.json(
      { message: "Detalle de venta eliminado correctamente" },
      { status: 200 }
    );

    // Agregar encabezado Cache-Control para evitar que se cachee
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

    return response;
  } catch (error) {
    console.error("Error eliminando el detalle de venta:", error);
    return NextResponse.json(
      { error: "Error al eliminar el detalle de venta" },
      { status: 500 }
    );
  }
}
