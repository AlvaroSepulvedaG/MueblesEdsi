"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";


export type Compra = {
  num_compra: number;
  descripcion_compra: string;
  monto_compra: number;
  folio_documento?: number;
  fecha_compra: Date;
  proveedor_rut_proveedor: string;
  tipo_documento_id_tipo_documento: number;
  nombre_proveedor: string;
  telefono_proveedor: number;
  correo_proveedor: string;
  nombre_tipo_documento: string;
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    num_compra?: number;
}

// Función para formatear el RUT
const formatRut = (rut: string | undefined) => {
  if (!rut) return "";
  // Remueve puntos y guiones
  let cleanRut = rut.replace(/\./g, "").replace(/-/g, "");

  // Asegúrate de que tenga al menos 8 caracteres para evitar errores
  if (cleanRut.length < 9) return rut;

  // Obtén el número y el dígito verificador
  const number = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);

  // Formatea el número con puntos y agrega el dígito verificador con un guión
  return `${number.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${verifier}`;
};

const SupplierActions = ({ proveedor }: { proveedor: Compra }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  // Verifica el contenido de proveedor
  console.log("Proveedor:", proveedor);
  React.useEffect(() => {
    const storedMessage = localStorage.getItem("successMessage");
    if (storedMessage) {
      setSuccessMessage(storedMessage);
      localStorage.removeItem("successMessage");
    }
  }, []);
  const handleDelete = async () => {
    try {
      // Eliminar la compra
      const compraResponse = await fetch(`/api/deleteCompra`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_compra: proveedor.num_compra }),
      });

      if (!compraResponse.ok) {
        const compraErrorData = await compraResponse.json();
        alert(`Error eliminando la compra: ${compraErrorData.error}`);
        return; // Salir si ocurre un error eliminando la compra
      }

      // Mensaje de éxito y cierre del modal
      setSuccessMessage("Compra eliminada correctamente"); // Muestra el mensaje
      setIsModalVisible(false); // Cierra el modal

      // Oculta el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
        router.refresh(); // Refresca la página
      }, 3000);
    } catch (error) {
      console.error("Error eliminando la compra:", error);
      alert("Ocurrió un error al intentar eliminar la compra");
    }
  };

  const openModal = () => {
    setConfirmAction(() => handleDelete); // Configura la acción que se ejecutará al confirmar
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setConfirmAction(null);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-200">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(proveedor.correo_proveedor)}
          >
            Copiar correo
          </DropdownMenuItem>



          <DropdownMenuItem
            onClick={() =>
                navigator.clipboard.writeText(String(proveedor.telefono_proveedor))
            }
          >
            Copiar teléfono
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/comenunca/compras/${proveedor.num_compra}`}>
              Editar
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={openModal}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Modal para confirmar eliminación */}
      <Modal
        isVisible={isModalVisible}
        title={successMessage ? "Éxito" : "Confirmar eliminación"} // Cambia el título según el estado
        message={
          successMessage
            ? successMessage // Muestra el mensaje de éxito
            : `¿Estás seguro de que deseas eliminar la compra de ${proveedor.nombre_proveedor}?`
        }
        onClose={closeModal}
        closeText={successMessage ? "Cerrar" : "Cancelar"}
      >
        {!successMessage && (
          <Button
            className="bg-red-500 text-white mt-4"
            onClick={() => {
              if (confirmAction) {
                confirmAction(); // Ejecuta la acción configurada
              }
            }}
          >
            Confirmar
          </Button>
        )}
      </Modal>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md transition-opacity duration-300">
          {successMessage}
        </div>
      )}
    </div>
  );
};


//funcion de cambio de formato de fecha
function formatDateToDDMMYYYY(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

// Definición de columnas
export const columns: ColumnDef<Compra>[] = [

  {
    accessorKey: "num_compra",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        N° Compra
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "proveedor_rut_proveedor",
    cell: ({ row }) => formatRut(row.original.proveedor_rut_proveedor),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        RUT Proveedor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorFn: (row) =>
      `${row.nombre_proveedor}`,
    id: "Nombre",
  },

  { accessorKey: "descripcion_compra", header: "Detalle" },

  {
    accessorKey: "monto_compra",
    header: "Monto",
    cell: ({ row }) => {
      const value = row.original.monto_compra;
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(value);
    },
  },



  {
    accessorKey: "fecha_compra", 
    header: "Fecha", 
    cell: ({ row }) => {
      // Cambiar formato para la visualizacion
      return formatDateToDDMMYYYY(new Date(row.original.fecha_compra));
    },
  },

  { accessorKey: "nombre_tipo_documento", header: "Documento" },


  

  {
    id: "actions",
    cell: ({ row }) => <SupplierActions proveedor={row.original} />,
  },
];
