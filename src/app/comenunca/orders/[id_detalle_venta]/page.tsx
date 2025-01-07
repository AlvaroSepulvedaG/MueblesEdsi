import pool from "@/lib/db"; // Importa la conexión a la base de datos
import { Pedido } from "@/components/ui/Ventas/ColumnsOrders";
import { OrderForm } from "@/components/ui/Ventas/OrderForm";

async function getData(id_detalle_venta: number): Promise<Pedido | undefined> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT * FROM public.venta vnt INNER JOIN public.detalle_venta dt on vnt.num_venta=dt.venta_num_venta INNER JOIN public.cliente cli on vnt.cliente_rut=cli.rut INNER JOIN public.producto prd on dt.producto_id_producto=prd.id_producto WHERE dt.id_detalle_venta = $1",
      [id_detalle_venta]
    );
    client.release();

    if (res.rows.length > 0) {
      const {
        num_venta,
        id_detalle_venta,
        id_producto,
        rut,
        cliente_rut,
        telefono_movil,
        nombres,
        apellido_paterno,
        fecha_estimada,
        direccion,
        email,
        precio,
        abono,
        apellido_materno,
        nombre_producto,
        cod_producto,
      } = res.rows[0];
      return {
        rut,
        num_venta,
        id_producto,
        id_detalle_venta,
        cliente_rut,
        telefono_movil,
        nombres,
        email,
        apellido_paterno,
        fecha_estimada,
        direccion,
        precio,
        abono,
        apellido_materno,
        nombre_producto,
        cod_producto,
      };
    }
  } catch (error) {
    console.error("Error fetching client data:", error);
  }
  return undefined;
}

export default async function VentaDetalles({
  params,
}: {
  params: { id_detalle_venta: number };
}) {
  const data = await getData(params.id_detalle_venta);

  return (
    <div className="flex flex-col place-content-center items-center">
      <h3 className="text-4xl text-[#DC5F00] font-bold mt-52 mb-8">Orden</h3>
      {data ? (
        <OrderForm
          num_venta={data.num_venta}
          id_detalle_venta={data.id_detalle_venta}
          abono={data.abono}
          productos={
            data.precio
              ? [
                  {
                    nombre_producto: data.nombre_producto,
                    codigo_producto: data.cod_producto,
                    precio: data.precio,
                    id_producto: data.id_producto,
                  },
                ]
              : [
                  {
                    nombre_producto: "",
                    codigo_producto: "",
                    precio: 0,
                    id_producto: 0,
                  },
                ]
          }
          cliente_rut={data.cliente_rut}
          nombres={data.nombres}
          apellido_paterno={data.apellido_paterno}
          apellido_materno={data.apellido_materno}
          fecha_estimada={data.fecha_estimada}
          direccion={data.direccion}
          telefono_movil={data.telefono_movil}
          isEditable
        />
      ) : (
        <p>No se encontró el cliente.</p>
      )}
    </div>
  );
}
