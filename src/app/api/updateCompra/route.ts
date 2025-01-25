import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface CompraData {
  num_compra: number;
  descripcion_compra: string;
  monto_compra: number;
  folio_documento?: number;
  fecha_compra: Date;
  proveedor_rut_proveedor: string;
  tipo_documento_id_tipo_documento: string;
}

export async function PUT(req: Request) {
  const client = await pool.connect();
  try {
    const body: CompraData = await req.json();
    const { num_compra, descripcion_compra, monto_compra, folio_documento, fecha_compra, proveedor_rut_proveedor, tipo_documento_id_tipo_documento } = body;

    await client.query("BEGIN");

    // Actualizar venta
    await client.query(
      `
      UPDATE public.compra
      SET descripcion_compra = $2, monto_compra = $3, folio_documento = $4, fecha_compra = $5, proveedor_rut_proveedor = $6, tipo_documento_id_tipo_documento = $7
      WHERE num_compra = $1
      `,
      [num_compra, descripcion_compra, monto_compra, folio_documento, fecha_compra, proveedor_rut_proveedor, tipo_documento_id_tipo_documento]
    );

    
    await client.query("COMMIT");

    return NextResponse.json({ message: "Compra actualizada correctamente" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar la" }, { status: 500 });
  } finally {
    client.release();
  }
}
