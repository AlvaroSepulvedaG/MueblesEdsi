//WIP

import { columns, Compra } from "@/components/ui/Compras/ColumnsCompra";
import pool from "@/lib/db"; // Conexion a BDD

import DataTable from "@/components/ui/Compras/CompraTable";

// Función para obtener los datos de los clientes desde la base de datos
async function getData(): Promise<Compra[]> {
  try {
    const order = await pool.connect();
    const res = await order.query(
      "SELECT * FROM public.compra com INNER JOIN public.proveedor pro on com.proveedor_rut_proveedor = pro.rut_proveedor INNER JOIN public.tipo_documento tip on com.tipo_documento_id_tipo_documento = tip.id_tipo_documento "
    );
    order.release();
        
    // Mapea los datos obtenidos de la base de datos al tipo `Compra`
    return res.rows.map((row: any) => ({
      num_compra: row.num_compra,
      proveedor_rut_proveedor: row.proveedor_rut_proveedor,
      descripcion_compra: row.descripcion_compra, // Ajusta según el nombre de la columna en tu base de datos
      monto_compra: row.monto_compra,
      folio_documento: row.folio_documento,
      fecha_compra: row.fecha_compra,
      tipo_documento_id_tipo_documento: row.tipo_documento_id_tipo_documento,
      nombre_proveedor: row.nombre_proveedor,
      telefono_proveedor: row.telefono_proveedor,
      correo_proveedor: row.correo_proveedor,
      nombre_tipo_documento: row.nombre_tipo_documento,
    }));
  } catch (error) {
    console.error("Error recolectando datos:", error);
    return []; // Devuelve un array vacío en caso de error
  }
}

export default async function Proveedores() {
  const data = await getData();
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold">Compras</h3>
      <DataTable columns={columns} data={data} />
    </div>
  );
}


//wip