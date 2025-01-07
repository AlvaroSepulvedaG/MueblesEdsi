import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface UpdateData {
  num_venta: number;
  cliente_rut?: string;
  fecha_estimada?: string;
  abono?: number;
  id_detalle_venta: number;
  items: Array<{
    producto_id_producto?: string;
    precio?: number;
  }>;
}

export async function PUT(req: Request) {
  const client = await pool.connect();
  try {
    const body: UpdateData = await req.json();
    const { num_venta, cliente_rut, fecha_estimada, abono, id_detalle_venta, items } = body;

    // Validación de datos básicos
    if (!num_venta || !id_detalle_venta) {
      return NextResponse.json(
        { error: "Los campos num_venta e id_detalle_venta son obligatorios." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Actualizar venta
    await client.query(
      `
      UPDATE public.venta
      SET cliente_rut = $1, fecha_entrega = $2, abono = $3
      WHERE num_venta = $4
      `,
      [cliente_rut, fecha_estimada, abono, num_venta]
    );

    // Actualizar o insertar detalles de venta
    for (const item of items) {
      const { producto_id_producto, precio } = item;

      if (producto_id_producto) {
        // Actualizar si ya existe
        await client.query(
          `
          UPDATE public.detalle_venta
          SET precio = $1
          WHERE id_detalle_venta = $2 AND producto_id_producto = $3
          `,
          [precio, id_detalle_venta, producto_id_producto]
        );
      } else {
        // Insertar un nuevo detalle si no existe
        await client.query(
          `
          INSERT INTO public.detalle_venta (venta_num_venta, producto_id_producto, cantidad, precio)
          VALUES ($1, 1, $2)
          ON CONFLICT (id_detalle_venta) DO NOTHING
          `,
          [num_venta, producto_id_producto, precio]
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar el pedido" }, { status: 500 });
  } finally {
    client.release();
  }
}
