// src/app/api/updateVenta/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos de la venta
interface VentaData {
  num_venta: number;
  fecha_estimada?: Date;
  abono?: number;
  fecha_venta?: Date;
}

// Manejo del método PUT
export async function PUT(req: Request) {
  try {
    const body: VentaData = await req.json();
    const { num_venta, fecha_estimada, abono, fecha_venta } = body;

    // Verifica si se proporciona el número de venta
    if (!num_venta) {
      return NextResponse.json(
        { error: "El número de venta es obligatorio" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE public.venta
      SET
        fecha_estimada = COALESCE($2, fecha_estimada),
        abono = COALESCE($3, abono),
        fecha_venta = COALESCE($4, fecha_venta)
        
      WHERE num_venta = $1
      RETURNING *
    `;
    const values = [num_venta, fecha_estimada, abono, fecha_venta];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    return NextResponse.json(
      { error: "Error al actualizar la venta" },
      { status: 500 }
    );
  }
}
