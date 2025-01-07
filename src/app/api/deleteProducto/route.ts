// src/app/api/deleteProducto/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos del producto a eliminar
interface ProductoDeleteData {
  id_producto: number;
}

// Manejo del método DELETE
export async function DELETE(req: Request) {
  try {
    const { id_producto }: ProductoDeleteData = await req.json();

    // Verifica si se proporciona el ID del producto
    if (!id_producto) {
      return NextResponse.json(
        { error: "El ID del producto es obligatorio" },
        { status: 400 }
      );
    }

    // Consulta para eliminar un producto
    const query = `
      DELETE FROM public.producto
      WHERE id_producto = $1
      RETURNING *
    `;
    const values = [id_producto];

    const { rows } = await pool.query(query, values);

    // Verifica si se encontró y eliminó un producto
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Producto eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
