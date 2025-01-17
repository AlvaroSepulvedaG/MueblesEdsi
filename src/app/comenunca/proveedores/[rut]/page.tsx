import { ClientForm } from "@/components/ui/Clients/ClientForm";
import pool from "@/lib/db"; // Importa la conexión a la base de datos
import { Clientes } from "@/components/ui/Clients/ColumnsClients";

async function getData(rut: string): Promise<Clientes | undefined> {
  try {
    const client = await pool.connect();
    const res = await client.query(
      "SELECT * FROM public.cliente cli INNER JOIN public.comuna com on cli.comuna_id_comuna=com.id_comuna WHERE rut = $1",
      [rut]
    );
    client.release();

    if (res.rows.length > 0) {
      const {
        rut,
        telefono_movil,
        nombres,
        correo,
        fecha_registro,
        apellido_paterno,
        direccion,
        apellido_materno,
        comentarios,
        comuna_id_comuna,
      } = res.rows[0];
      return {
        rut,
        telefono_movil,
        nombres,
        correo,
        fecha_registro,
        apellido_paterno,
        direccion,
        apellido_materno,
        comentarios,
        comuna_id_comuna,
      };
    }
  } catch (error) {
    console.error("Error fetching client data:", error);
  }
  return undefined;
}

export default async function ClienteDetalles({
  params,
}: {
  params: { rut: string };
}) {
  const data = await getData(params.rut);

  return (
    <div className="flex flex-col place-content-center items-center">
      <h3 className="text-4xl text-[#DC5F00] font-bold mt-52 mb-8">Proveedores</h3>
      {data ? (
        <ClientForm
          rut={data.rut}
          nombres={data.nombres}
          apellido_paterno={data.apellido_paterno}
          apellido_materno={data.apellido_materno}
          direccion={data.direccion}
          fecha_registro={data.fecha_registro}
          correo={data.correo}
          telefono_movil={data.telefono_movil}
          comentarios={data.comentarios}
          comuna_id_comuna={data.comuna_id_comuna}
          isEditable
        />
      ) : (
        <p>No se encontró el cliente.</p>
      )}
    </div>
  );
}
