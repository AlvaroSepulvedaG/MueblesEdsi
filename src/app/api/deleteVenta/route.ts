// src/app/api/deleteCliente/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos del cliente a eliminar
interface VentaDeleteData {
  num_venta: number;
}

// Manejo del método DELETE
export async function DELETE(req: Request) {
  try {
    const { num_venta }: VentaDeleteData = await req.json();

    // Verifica si se proporciona el RUT
    if (!num_venta) {
      return NextResponse.json({ error: 'El ID de venta es obligatorio' }, { status: 400 });
    }

    // Consulta para eliminar un cliente
    const query = `
      DELETE FROM public.venta
      WHERE num_venta = $1
      RETURNING *
    `;
    const values = [num_venta];

    const { rows } = await pool.query(query, values);

    // Verifica si se encontró y eliminó un cliente
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Venta no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Venta eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Error deleting order' }, { status: 500 });
  }
}
