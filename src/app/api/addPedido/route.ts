// src/app/api/addPedido/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos del pedido
interface PedidoData {
  cliente_rut: string;
  fecha_estimada?: Date;
  abono?: number;
  items: Array<{
    codigo_producto: string;
    nombre_producto: string;
    precio: number;
  }>;
}

// Manejo del método POST para agregar un pedido
export async function POST(req: Request) {
  try {
    const body: PedidoData = await req.json();
    const { cliente_rut, fecha_estimada, abono, items } = body;

    // Validación de datos básicos
    if (!cliente_rut || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: cliente_rut o items." },
        { status: 400 }
      );
    }

    // Obtener la fecha actual para la columna `fecha_venta`
    const fecha_venta = new Date();

    // Iniciar transacción
    const client = await pool.connect();
    await client.query("BEGIN");

    // Insertar el pedido en la tabla `venta` con `fecha_venta`
    const queryVenta = `
      INSERT INTO public.venta (cliente_rut, fecha_estimada, abono, fecha_venta)
      VALUES ($1, $2, $3, $4)
      RETURNING num_venta
    `;
    const valuesVenta = [cliente_rut, fecha_estimada, abono, fecha_venta];
    const { rows: ventaRows } = await client.query(queryVenta, valuesVenta);

    if (ventaRows.length === 0) {
      throw new Error("No se pudo insertar el pedido");
    }

    const num_venta = ventaRows[0].num_venta; // Obtener el num_venta generado automáticamente

    // Insertar producto y detalles del pedido
    for (const item of items) {
      const { codigo_producto, nombre_producto, precio } = item;

      // Verificar si el producto ya existe
      const queryProductoExistente = `
        SELECT id_producto FROM public.producto WHERE cod_producto = $1
      `;
      const { rows: productoRows } = await client.query(
        queryProductoExistente,
        [codigo_producto]
      );

      let id_producto;

      if (productoRows.length > 0) {
        // El producto ya existe
        id_producto = productoRows[0].id_producto;
      } else {
        // Insertar nuevo producto
        const queryInsertProducto = `
          INSERT INTO public.producto (cod_producto, nombre_producto, precio_producto)
          VALUES ($1, $2, $3)
          RETURNING id_producto
        `;
        const { rows: nuevoProductoRows } = await client.query(
          queryInsertProducto,
          [codigo_producto, nombre_producto, precio]
        );
        id_producto = nuevoProductoRows[0].id_producto;
      }

      // Insertar el detalle de la venta
      const queryDetalleVenta = `
        INSERT INTO public.detalle_venta (venta_num_venta, producto_id_producto, cantidad, precio, estado)
        VALUES ($1, $2, 1, $3, $4)  -- La cantidad es 1 por defecto
      `;
      await client.query(queryDetalleVenta, [
        num_venta,
        id_producto,
        precio,
        "Pendiente",
      ]);
    }

    // Confirmar la transacción
    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Pedido agregado exitosamente", num_venta },
      { status: 200 }
    );
  } catch (error) {
    await pool.query("ROLLBACK"); // Deshacer cambios en caso de error
    console.error("Error adding pedido:", error);
    return NextResponse.json(
      { error: "Error al agregar el pedido" },
      { status: 500 }
    );
  }
}
