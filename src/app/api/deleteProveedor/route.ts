import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { rut_proveedor }: { rut_proveedor: string } = await req.json();

    if (!rut_proveedor) {
      return NextResponse.json({ error: "El RUT del proveedor es obligatorio" }, { status: 400 });
    }

    await pool.query("BEGIN"); 

    // Eliminar las compras relacionadas con el proveedor
    const deleteComprasQuery = `
      DELETE FROM public.compra
      WHERE Proveedor_rut_proveedor = $1
      RETURNING *
    `;
    await pool.query(deleteComprasQuery, [rut_proveedor]);

    // Eliminar el proveedor
    const deleteProveedorQuery = `
      DELETE FROM public.proveedor
      WHERE rut_proveedor = $1
      RETURNING *
    `;
    const { rows } = await pool.query(deleteProveedorQuery, [rut_proveedor]);

    await pool.query("COMMIT"); // Confirma la transacción

    if (rows.length === 0) {
      return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Proveedor y sus compras asociadas eliminados correctamente" }, { status: 200 });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revierte la transacción en caso de error
    console.error("Error eliminando proveedor:", error);
    return NextResponse.json({ error: "Error eliminando proveedor y sus compras asociadas" }, { status: 500 });
  }
}
