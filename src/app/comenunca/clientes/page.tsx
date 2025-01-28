import DataTable from "@/components/ui/Clients/ClientTable";
import { columns, Clientes } from "@/components/ui/Clients/ColumnsClients";
import pool from "@/lib/db"; // Conexión a la base de datos

async function getData(): Promise<Clientes[]> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT DISTINCT ON (cli.rut) 
       cli.rut, 
       cli.telefono_movil, 
       cli.nombres, 
       cli.correo, 
       cli.apellido_paterno, 
       cli.apellido_materno, 
       cli.direccion 
FROM public.cliente cli
LEFT JOIN public.venta vnt ON cli.rut = vnt.cliente_rut
LEFT JOIN public.detalle_venta dt ON vnt.num_venta = dt.venta_num_venta
LEFT JOIN public.producto prod ON dt.producto_id_producto = prod.id_producto
ORDER BY cli.rut, dt.id_detalle_venta DESC;
`    );
    client.release();

    // Mapear los resultados para que coincidan con el tipo Clientes
    return res.rows.map((row: any) => ({
      rut: row.rut,
      telefono_movil: row.telefono_movil,
      nombres: row.nombres,
      correo: row.correo,
      apellido_paterno: row.apellido_paterno,
      apellido_materno: row.apellido_materno,
      dirección: row.dirección,
      correo: row.correo,
    }));
  } catch (error) {
    console.error("Error al obtener datos de clientes:", error);
    return [];
  }
}

export default async function ClientesPage() {
  const data = await getData();

  return (
    <div className="flex flex-col place-content-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold mb-8">Clientes</h3>
      {data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <p>No se encontraron clientes.</p>
      )}
    </div>
  );
}
