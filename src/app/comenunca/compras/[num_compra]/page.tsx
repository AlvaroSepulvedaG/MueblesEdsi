import pool from "@/lib/db"; 
import { Compra } from "@/components/ui/Compras/ColumnsCompra";
import { CompraForm } from "@/components/ui/Compras/CompraForm";

async function getData(num_compra: number): Promise<Compra | undefined> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT * FROM public.compra com INNER JOIN public.proveedor pro on com.proveedor_rut_proveedor = pro.rut_proveedor INNER JOIN public.tipo_documento tip on com.tipo_documento_id_tipo_documento = tip.id_tipo_documento WHERE com.num_compra = $1",
      [num_compra]
    );
    client.release();

    
    if (res.rows.length > 0) {
      const {
        num_compra,
        descripcion_compra,
        monto_compra,
        folio_documento,
        fecha_compra,
        proveedor_rut_proveedor,
        tipo_documento_id_tipo_documento,
        nombre_proveedor,
        telefono_proveedor,
        correo_proveedor,
        nombre_tipo_documento,
      } = res.rows[0];
      return {
        num_compra,
        descripcion_compra,
        monto_compra,
        folio_documento,
        fecha_compra,
        proveedor_rut_proveedor,
        tipo_documento_id_tipo_documento,
        nombre_proveedor,
        telefono_proveedor,
        correo_proveedor,
        nombre_tipo_documento,
      };
    }
  } catch (error) {
    console.error("Error obteniendo informacion de la compra:", error);
  }
  return undefined;
}

export default async function CompraDetalles({
  params,
}: {
  params: { num_compra: number };
}) {
    const num_compra = parseInt(params.num_compra as unknown as string, 10);
    const data = await getData(num_compra); 

  return (
    <div className="flex flex-col place-content-center items-center">
      <h3 className="text-4xl text-[#DC5F00] font-bold mt-52 mb-8">Orden</h3>
      {data ? (
        <CompraForm
          num_compra={data.num_compra}
          descripcion_compra={data.descripcion_compra}
          monto_compra={data.monto_compra}    
          folio_documento={data.folio_documento}
          fecha_compra={data.fecha_compra}
          proveedor_rut_proveedor={data.proveedor_rut_proveedor}
          tipo_documento_id_tipo_documento={data.tipo_documento_id_tipo_documento}
          nombre_proveedor={data.nombre_proveedor}
          telefono_proveedor={data.telefono_proveedor}
          correo_proveedor={data.correo_proveedor}
          nombre_tipo_documento={data.nombre_tipo_documento}
          isEditable
        />
      ) : (
        <p>No se encontró la compra.</p>
      )}
    </div>
  );
}
