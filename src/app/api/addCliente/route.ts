// src/app/api/addCliente/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Asegúrate de que la ruta de la conexión esté bien configurada

// Define una interfaz para los datos del cliente
interface ClientData {
  rut: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_registro?: Date;
  direccion: string;
  telefono_fijo?: number;
  telefono_movil: number;
  correo: string;
  comentarios?: string;
  comuna_id_comuna: number;
}

// Manejo del método POST
export async function POST(req: Request) {
  try {
    const body: ClientData = await req.json();

    const {
      rut,
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

    const query = `
      INSERT INTO 
      public.cliente (rut, nombres, apellido_paterno, apellido_materno, fecha_registro, direccion, telefono_fijo, telefono_movil, correo, comentarios,comuna_id_comuna)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      rut,
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

    const { rows } = await pool.query(query, values);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error adding client:", error);
    return NextResponse.json({ error: "Error adding client" }, { status: 500 });
  }
}
