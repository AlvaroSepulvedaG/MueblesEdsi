import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const {
    descripcion_compra,
    monto_compra,
    folio_documento,
    fecha_compra,
    proveedor_rut_proveedor,
    tipo_documento_id_tipo_documento,
  } = await request.json();

  try {
    // Log de los valores que se van a insertar
    console.log("Datos a insertar:", {
      descripcion_compra,
      monto_compra,
      folio_documento,
      fecha_compra,
      proveedor_rut_proveedor,
      tipo_documento_id_tipo_documento,
    });

    // Consulta a BDD
    const result = await pool.query(
      `INSERT INTO public.compra (descripcion_compra, monto_compra, folio_documento, fecha_compra, Proveedor_rut_proveedor, tipo_documento_id_tipo_documento) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING num_compra`,
      [
        descripcion_compra,
        monto_compra,
        folio_documento,
        fecha_compra,
        proveedor_rut_proveedor,
        tipo_documento_id_tipo_documento,
      ]
    );

    // Devuelve una respuesta JSON con el ID de la venta creada
    return NextResponse.json({ num_compra: result.rows[0].num_compra });
  } catch (error) {
    // Log adicional en caso de error
    console.error("Error al insertar compraa:", error);
    console.error("Datos en el momento del error:", {
      descripcion_compra,
      monto_compra,
      folio_documento,
      fecha_compra,
      proveedor_rut_proveedor,
      tipo_documento_id_tipo_documento,
    });

    return NextResponse.json(
      { error: "Error al insertar compra" },
      { status: 500 }
    );
  }
}
