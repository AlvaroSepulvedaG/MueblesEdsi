import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      rut, // RUT actual
      nuevoRut, // Nuevo RUT (si aplica)
      nombres,
      apellido_paterno,
      apellido_materno,
      fecha_registro,
      direccion,
      telefono_fijo,
      telefono_movil,
      correo,
      comentarios,
      comuna_id_comuna,
    } = body;

    if (!rut) {
      return NextResponse.json(
        { error: "El RUT actual es obligatorio" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Actualizar la tabla cliente primero
      const queryCliente = `
        UPDATE public.cliente
        SET
          rut = COALESCE($2, rut),
          nombres = COALESCE($3, nombres),
          apellido_paterno = COALESCE($4, apellido_paterno),
          apellido_materno = COALESCE($5, apellido_materno),
          fecha_registro = COALESCE($6, fecha_registro),
          direccion = COALESCE($7, direccion),
          telefono_fijo = COALESCE($8, telefono_fijo),
          telefono_movil = COALESCE($9, telefono_movil),
          correo = COALESCE($10, correo),
          comentarios = COALESCE($11, comentarios),
          comuna_id_comuna = COALESCE($12, comuna_id_comuna)
        WHERE rut = $1
        RETURNING *
      `;

      const valuesCliente = [
        rut,
        nuevoRut || rut,
        nombres,
        apellido_paterno,
        apellido_materno,
        fecha_registro,
        direccion,
        telefono_fijo,
        telefono_movil,
        correo,
        comentarios,
        comuna_id_comuna,
      ];

      const { rows } = await client.query(queryCliente, valuesCliente);

      if (rows.length === 0) {
        throw new Error("Cliente no encontrado");
      }

      // Si el nuevo RUT es diferente, actualizar la tabla venta
      if (nuevoRut && nuevoRut !== rut) {
        await client.query(
          `
          UPDATE public.venta
          SET cliente_rut = $1
          WHERE cliente_rut = $2
          `,
          [nuevoRut, rut]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error updating client:", error);
      return NextResponse.json(
        { error: "Error updating client" },
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
