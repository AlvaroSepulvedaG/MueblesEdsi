import OrdersTable from "@/components/ui/Ventas/OrdersTable";
import { columns, Pedido } from "@/components/ui/Ventas/ColumnsOrders";
import pool from "@/lib/db"; // Importa la conexión a la base de datos

import DataTable from "@/components/ui/Ventas/OrdersTable";

// Función para obtener los datos de los clientes desde la base de datos
async function getData(): Promise<Pedido[]> {
  try {
    const order = await pool.connect();
    const res = await order.query(
      "SELECT * FROM public.venta vnt INNER JOIN public.detalle_venta dt on vnt.num_venta=dt.venta_num_venta INNER JOIN public.cliente cli on vnt.cliente_rut=cli.rut INNER JOIN public.producto prod on dt.producto_id_producto=prod.id_producto ORDER BY id_detalle_venta DESC"
    );
    order.release();

    // Mapea los datos obtenidos de la base de datos al tipo `Pedidos`
    return res.rows.map((row: any) => ({
      cliente_rut: row.cliente_rut,
      estado: row.estado, // Ajusta según el nombre de la columna en tu base de datos
      nombres: row.nombres,
      producto_id_producto: row.producto_id_producto,
      apellido_paterno: row.apellido_paterno,
      apellido_materno: row.apellido_materno,
      telefono_movil: row.telefono_movil,
      direccion: row.direccion,
      num_venta: row.num_venta,
      id_detalle_venta: row.id_detalle_venta,
      nombre_producto: row.nombre_producto,
      precio: row.precio,
      correo: row.correo,
    }));
    console.log(res)
  } catch (error) {
    console.error("Error fetching client data:", error);
    return []; // Devuelve un array vacío en caso de error
  }
}

export default async function Clientes() {
  const data = await getData();
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold">Pedidos</h3>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
