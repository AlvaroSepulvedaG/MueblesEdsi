// src/app/api/deleteCliente/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { rut }: { rut: string } = await req.json();

    if (!rut) {
      return NextResponse.json({ error: "El RUT del cliente es obligatorio" }, { status: 400 });
    }

    await pool.query("BEGIN"); // Inicia una transacción

    // 1. Eliminar detalles de las ventas relacionadas con el cliente
    const deleteDetallesQuery = `
      DELETE FROM public.detalle_venta
      WHERE venta_num_venta IN (
        SELECT num_venta FROM public.venta WHERE cliente_rut = $1
      )
    `;
    await pool.query(deleteDetallesQuery, [rut]);

    // 2. Eliminar ventas relacionadas con el cliente
    const deleteVentasQuery = `
      DELETE FROM public.venta
      WHERE cliente_rut = $1
    `;
    await pool.query(deleteVentasQuery, [rut]);

    // 3. Eliminar el cliente
    const deleteClienteQuery = `
      DELETE FROM public.cliente
      WHERE rut = $1
      RETURNING *
    `;
    const { rows } = await pool.query(deleteClienteQuery, [rut]);

    await pool.query("COMMIT"); // Confirma la transacción

    if (rows.length === 0) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cliente y sus ventas eliminados correctamente" }, { status: 200 });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revierte la transacción en caso de error
    console.error("Error eliminando cliente:", error);
    return NextResponse.json({ error: "Error eliminando cliente y sus ventas" }, { status: 500 });
  }
}
