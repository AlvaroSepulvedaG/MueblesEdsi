import DataTable from "@/components/ui/Supplier/SupplierTable";
import { columns, Proveedores } from "@/components/ui/Supplier/ColumnsSupplier";
import pool from "@/lib/db"; // Conexión a la base de datos

async function getData(): Promise<Proveedores[]> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT * FROM public.proveedor ORDER BY rut_proveedor DESC"
    );
    client.release();

    // Imprimir los resultados obtenidos de la base de datos
    console.log("Datos obtenidos de la base de datos (antes del mapeo):", res.rows);

    // Mapear los resultados para que coincidan con el tipo Proveedores
    const proveedores = res.rows.map((row: any) => ({
      rut_proveedor: row.rut_proveedor,
      nombre_proveedor: row.nombre_proveedor,
      telefono_proveedor: row.telefono_proveedor,
      correo_proveedor: row.correo_proveedor,
    }));

    // Imprimir los datos mapeados
    console.log("Datos mapeados:", proveedores);

    return proveedores;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Ahora TypeScript sabe que 'error' es una instancia de Error
      console.error("Error al obtener datos de proveedores:", error.message);
    } else {
      // Si el error no es una instancia de Error, solo imprimes el error completo
      console.error("Error desconocido:", error);
    }
    return [];
  }

export default async function ProveedoresPage() {
  const data = await getData();

  // Imprimir los datos obtenidos en el componente
  console.log("Datos pasados al componente:", data);

  return (
    <div className="flex flex-col place-content-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold mb-8">Proveedores</h3>
      {data.length > 0 ? (
        <DataTable columns={columns} data={data} />
      ) : (
        <p>No se encontraron proveedores.</p>
      )}
    </div>
  );
}
