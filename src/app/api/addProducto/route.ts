import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que esta ruta sea correcta

export async function POST(req: Request) {
  try {
    const { nombre_producto, cod_producto, precio_producto } = await req.json();

    // Validación básica
    if (!nombre_producto || !cod_producto || !precio_producto) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Insertar producto y devolver el ID generado
    const query = `
      INSERT INTO public.producto (nombre_producto, cod_producto, precio_producto)
      VALUES ($1, $2, $3)
      RETURNING id_producto
    `;
    const values = [nombre_producto, cod_producto, precio_producto];

    const { rows } = await pool.query(query, values);

    // Verificar si el ID fue devuelto
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Error al crear el producto" },
        { status: 500 }
      );
    }

    // Devolver el ID del producto
    return NextResponse.json({ id_producto: rows[0].id_producto }, { status: 201 });
  } catch (error) {
    console.error("Error en addProducto:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
