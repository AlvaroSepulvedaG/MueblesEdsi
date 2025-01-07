import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.venta vnt
       INNER JOIN public.detalle_venta dt ON vnt.num_venta = dt.venta_num_venta
       INNER JOIN public.producto prd ON dt.producto_id_producto = prd.id_producto
       ORDER BY dt.id_detalle_venta ASC`
    );

    return NextResponse.json(result.rows, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: unknown) {
    console.error("Database error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Database error", details: errorMessage },
      { status: 500 }
    );
  }
}
