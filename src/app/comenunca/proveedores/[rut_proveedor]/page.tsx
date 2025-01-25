import { SupplierForm } from "@/components/ui/Supplier/SupplierForm";
import pool from "@/lib/db"; // Importa la conexión a la base de datos
import { Proveedores } from "@/components/ui/Supplier/ColumnsSupplier";

async function getData(rut_proveedor: string): Promise<Proveedores | undefined> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT * FROM public.proveedor WHERE rut_proveedor = $1",
      [rut_proveedor]
    );
    client.release();

    if (res.rows.length > 0) {
      const {
        rut_proveedor,
        nombre_proveedor,
        telefono_proveedor,
        correo_proveedor,
      } = res.rows[0];
      return {
        rut_proveedor,
        nombre_proveedor,
        telefono_proveedor,
        correo_proveedor,
      };
    }
  } catch (error) {
    console.error("Error obteniendo información del proveedor:", error);
  }
  return undefined;
}

export default async function ProveedorDetalles({
  params,
}: {
  params: { rut_proveedor: string };
}) {
  const data = await getData(params.rut_proveedor);

  return (
    <div className="flex flex-col place-content-center items-center">
      <h3 className="text-4xl text-[#DC5F00] font-bold mt-52 mb-8">Proveedores</h3>
      {data ? (
        <SupplierForm
          rut_proveedor={data.rut_proveedor}
          nombre_proveedor={data.nombre_proveedor}
          telefono_proveedor={data.telefono_proveedor}
          correo_proveedor={data.correo_proveedor}
          isEditable
        />
      ) : (
        <p>No se encontró el proveedor.</p>
      )}
    </div>
  );
}
