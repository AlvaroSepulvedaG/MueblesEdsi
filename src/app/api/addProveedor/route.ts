// src/app/api/addCliente/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; 

//Definir una interfaz para los datos del proveedor
interface SupplierData {
  rut_proveedor: string;
  nombre_proveedor: string;
  telefono_proveedor: number;
  correo_proveedor: string;
}

// Manejo del método POST
export async function POST(req: Request) {
  try {
    const body: SupplierData = await req.json();

    const {
      rut_proveedor,
      nombre_proveedor,
      telefono_proveedor,
      correo_proveedor,
    } = body;

    const query = `
      INSERT INTO 
      public.proveedor (rut_proveedor, nombre_proveedor, telefono_proveedor, correo_proveedor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      rut_proveedor,
      nombre_proveedor,
      telefono_proveedor,
      correo_proveedor,
    ];

    const { rows } = await pool.query(query, values);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error al agregar proveedor:", error);
    return NextResponse.json({ error: "Error al agregar proveedor" }, { status: 500 });
  }
}
