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
        dv.estado
      FROM 
        venta v
      JOIN 
        detalle_venta dv ON v.num_venta = dv.venta_num_venta
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

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
