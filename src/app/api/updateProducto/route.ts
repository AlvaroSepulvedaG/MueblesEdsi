// src/app/api/updateProducto/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos del producto
interface ProductoData {
  id_producto: number;
  cod_producto?: string;
  nombre_producto?: string;
  precio_producto?: number;
}

// Manejo del método PUT
export async function PUT(req: Request) {
  try {
    const body: ProductoData = await req.json();
    const { id_producto, cod_producto, nombre_producto, precio_producto } = body;

    // Verifica si se proporciona el ID del producto
    if (!id_producto) {
      return NextResponse.json(
        { error: "El ID del producto es obligatorio" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE public.producto
      SET
        cod_producto = COALESCE($2, cod_producto),
        nombre_producto = COALESCE($3, nombre_producto),
        precio_producto = COALESCE($4, precio_producto)
      WHERE id_producto = $1
      RETURNING *
    `;
    const values = [id_producto, cod_producto, nombre_producto, precio_producto];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}
