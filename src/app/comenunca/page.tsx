import { columns, Pedidos } from "@/components/ui/TableComponents/Columns";
import DataTable from "@/components/ui/TableComponents/DataTable";
import pool from "@/lib/db"; // Importa la conexión a la base de datos

async function getData(): Promise<Pedidos[]> {
  try {
    const order = await pool.connect();
    const res = await order.query(
      `SELECT 
  vnt.*, 
  dt.*, 
  prd.*, 
  cli.telefono_movil, 
  cli.correo, 
  cli.nombres AS cliente_nombres,
  cli.apellido_paterno AS cliente_apellido_paterno,
  cli.apellido_materno AS cliente_apellido_materno
FROM public.venta vnt
INNER JOIN public.detalle_venta dt ON vnt.num_venta = dt.venta_num_venta
INNER JOIN public.producto prd ON dt.producto_id_producto = prd.id_producto
INNER JOIN public.cliente cli ON vnt.cliente_rut = cli.rut
WHERE dt.estado != 'Entregado'
ORDER BY dt.id_detalle_venta ASC;`
    );
    order.release();

    // Mapea los datos obtenidos de la base de datos al tipo `Pedidos`
    return res.rows.map((row: any) => ({
      cliente_rut: row.cliente_rut,
      estado: row.estado, // Ajusta según el nombre de la columna en tu base de datos
      nombres: row.nombres,
      precio: row.precio,
      producto_id_producto: row.producto_id_producto,
      apellido_paterno: row.apellido_paterno,
      apellido_materno: row.apellido_materno,
      telefono_movil: row.telefono_movil,
      direccion: row.direccion,
      num_venta: row.num_venta,
      id_detalle_venta: row.id_detalle_venta,
      correo: row.correo,
    }));
  } catch (error) {
    console.error("Error fetching client data:", error);
    return []; // Devuelve un array vacío en caso de error
  }
}
export default async function PedidosPage() {
  const data = await getData();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 bg-gray-200 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h3 className="text-4xl text-[#DC5F00] font-bold rounded-lg">
        ¡Bienvenido a EDSI 2.0!
      </h3>
      <section className="row-start-2 h-full min-h-full">
        <div className="h-[670px]">
          <div className="container mx-auto py-1 rounded-lg border-solid border-2 border-gray-300 text-center bg-white h-full">
            <div className="font-bold">Pedidos</div>
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </section>
    </div>
  );
}
