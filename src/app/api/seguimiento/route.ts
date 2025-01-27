import { NextResponse } from 'next/server'; 
import pool from "../../../lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rut = searchParams.get('rut');
  const num_venta = searchParams.get('pedido');

  if (!rut || !num_venta) {
    return NextResponse.json(
      { error: 'Faltan parámetros rut o número de pedido' },
      { status: 400 }
    );
  }

  try {
    const query = `
      SELECT 
        v.fecha_estimada,
        v.fecha_entrega,
        dv.estado,
        p.nombre_producto
      FROM 
        venta v
      JOIN 
        detalle_venta dv ON v.num_venta = dv.venta_num_venta
      JOIN 
        producto p ON dv.producto_id_producto = p.id_producto
      WHERE 
        v.cliente_rut = $1 AND v.num_venta = $2;
    `;
    const values = [rut, num_venta];

    const { rows } = await pool.query(query, values);

    // Verifica si los datos llegaron correctamente
    console.log(rows);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró información para este RUT y pedido' },
        { status: 404 }
      );
    }

    // Mapear los resultados para cada producto
    const productos = rows.map(row => {
      const fechaEstimadaFormateada = row.fecha_estimada
        ? new Date(row.fecha_estimada).toISOString().split('T')[0]
        : null;
      const fechaEntregaFormateada = row.fecha_entrega
        ? new Date(row.fecha_entrega).toISOString().split('T')[0]
        : null;

      let mensaje = '';
      if (row.estado === 'Listo') {
        mensaje = `El producto ${row.nombre_producto} está listo para su retiro.`;
      } else if (row.estado === 'Entregado') {
        mensaje = `El producto ${row.nombre_producto} fue entregado el ${fechaEntregaFormateada}.`;
      } else {
        mensaje = `El producto ${row.nombre_producto} está en ${row.estado}. Fecha estimada de entrega: ${fechaEstimadaFormateada}.`;
      }

      return {
        nombre_producto: row.nombre_producto,
        estado: row.estado,
        fecha_estimada: fechaEstimadaFormateada,
        fecha_entrega: fechaEntregaFormateada,
        mensaje,
      };
    });

    return NextResponse.json({ productos });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
