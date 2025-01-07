// src/app/api/updateVenta/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos de la venta
interface VentaData {
  id_detalle_venta: number;
  cantidad?: number;
  producto_id_producto?: string;
  precio?: number;
  estado?: string;
}

// Manejo del método PUT
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id_detalle_venta, cantidad, producto_id_producto, precio, estado } = body;

    if (!id_detalle_venta) {
      return NextResponse.json(
        { error: "El Id de la venta es obligatorio" },
        { status: 400 }
      );
    }

    // Consulta para actualizar `detalle_venta`
    const detalleVentaQuery = `
      UPDATE public.detalle_venta
      SET
        cantidad = COALESCE($2, cantidad),
        producto_id_producto = COALESCE($3, producto_id_producto),
        precio = COALESCE($4, precio),
        estado = COALESCE($5, estado)
      WHERE id_detalle_venta = $1
      RETURNING venta_num_venta;
    `;
    const detalleVentaValues = [
      id_detalle_venta,
      cantidad,
      producto_id_producto,
      precio,
      estado,
    ];

    const { rows: detalleRows } = await pool.query(
      detalleVentaQuery,
      detalleVentaValues
    );

    if (detalleRows.length === 0) {
      return NextResponse.json(
        { error: "Detalle de venta no encontrado" },
        { status: 404 }
      );
    }

    const numVenta = detalleRows[0].venta_num_venta;

    // Si el estado es "Entregado", actualiza la fecha en la tabla `venta`
    if (estado === "Entregado") {
      const ventaQuery = `
        UPDATE public.venta
        SET fecha_entrega = NOW()
        WHERE num_venta = $1
      `;
      await pool.query(ventaQuery, [numVenta]);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating detalle_venta:", error);
    return NextResponse.json(
      { error: "Error updating detalle_venta" },
      { status: 500 }
    );
  }
}
