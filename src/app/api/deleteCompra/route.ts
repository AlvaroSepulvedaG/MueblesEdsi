import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { num_compra }: { num_compra: string } = await req.json();

    if (!num_compra) {
      return NextResponse.json({ error: "El RUT del proveedor es obligatorio" }, { status: 400 });
    }

    await pool.query("BEGIN"); 

    const deleteProveedorQuery = `
      DELETE FROM public.compra
      WHERE num_compra = $1
      RETURNING *
    `;
    const { rows } = await pool.query(deleteProveedorQuery, [num_compra]);

    await pool.query("COMMIT"); // Confirma la transacción

    if (rows.length === 0) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Compra eliminada correctamente" }, { status: 200 });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revierte la transacción en caso de error
    console.error("Error eliminando compra:", error);
    return NextResponse.json({ error: "Error eliminando compra" }, { status: 500 });
  }
}
