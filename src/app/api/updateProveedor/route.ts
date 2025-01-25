import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      rut_proveedor, // RUT actual
      nuevoRut, // Nuevo RUT (si aplica)
      nombre_proveedor,
      telefono_proveedor,
      correo_proveedor,      
    } = body;

    if (!rut_proveedor) {
      return NextResponse.json(
        { error: "El RUT actual es obligatorio" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Actualizar la tabla proveedor primero
      const queryProveedor = `
        UPDATE public.proveedor
        SET
          rut_proveedor = COALESCE($2, rut_proveedor),
          nombre_proveedor = COALESCE($3, nombre_proveedor),
          telefono_proveedor = COALESCE($4, telefono_proveedor),
          correo_proveedor = COALESCE($5, correo_proveedor)
        WHERE rut_proveedor = $1
        RETURNING *
      `;

      const valuesProveedor = [
        rut_proveedor,
        nuevoRut || rut_proveedor,
        nombre_proveedor,
        telefono_proveedor,
        correo_proveedor,
      ];

      const { rows } = await client.query(queryProveedor, valuesProveedor);

      if (rows.length === 0) {
        throw new Error("Proveedor no encontrado");
      }

      // Si el nuevo RUT es diferente, actualizar la tabla de compras
      if (nuevoRut && nuevoRut !== rut_proveedor) {
        await client.query(
          `
          UPDATE public.compra
          SET Proveedor_rut_proveedor = $1
          WHERE Proveedor_rut_proveedor = $2
          `,
          [nuevoRut, rut_proveedor]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error actualizando proveedor:", error);
      return NextResponse.json(
        { error: "Error actualizando proveedor" },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json(
      { error: "Error parsing request" },
      { status: 500 }
    );
  }
}
