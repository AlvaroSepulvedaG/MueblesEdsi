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

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró información para este RUT y pedido' },
        { status: 404 }
      );
    }

    const { fecha_estimada, estado, nombre_producto } = rows[0];

    // Formatear fecha a "YYYY-MM-DD"
    const fechaFormateada = new Date(fecha_estimada).toISOString().split('T')[0];

    // Generar mensaje amigable
    let mensaje = '';
    if (estado !== 'Entregado') {
      mensaje = `Su pedido ${nombre_producto} está en ${estado}. Fecha estimada de entrega: ${fechaFormateada}.`;
    }

    return NextResponse.json({
      fecha_estimada: fechaFormateada,
      estado,
      nombre_producto,
      mensaje,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}

