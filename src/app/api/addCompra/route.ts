import { NextResponse } from "next/server";
import pool from "@/lib/db"; 

export async function POST(request: Request) {
  const {descripcion_compra, monto_compra, folio_documento, fecha_compra, Proveedor_rut_proveedor, Documento_tipo_documento} = await request.json();

  try {
    // Consulta a BDD
    const result = await pool.query(
        `INSERT INTO public.compra (descripcion_compra, monto_compra, folio_documento, fecha_compra, Proveedor_rut_proveedor, Documento_tipo_documento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING num_compra`,
        [descripcion_compra, monto_compra, folio_documento, fecha_compra, Proveedor_rut_proveedor, Documento_tipo_documento]
    );
    
    // Devuelve una respuesta JSON con el ID de la venta creada
    return NextResponse.json({ num_venta: result.rows[0].num_venta });
  } catch (error) {
    console.error("Error al insertar compra:", error);
    return NextResponse.json({ error: "Error al insertar compra" }, { status: 500 });
  }
}
