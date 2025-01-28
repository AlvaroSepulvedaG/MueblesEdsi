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

export type Pedido = {
  rut: string;
  num_venta: number;
  id_detalle_venta: number;
  telefono_movil: string;
  nombres: string;
  correo: string;
  fecha_estimada: Date;
  apellido_paterno?: string;
  apellido_materno?: string;
  cliente_rut: string;
  direccion?: string;
  precio: number;
  abono?: number;
  nombre_producto: string;
  cod_producto: string;
  id_producto: number;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rutCliente?: string;
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

const ClientActions = ({ cliente }: { cliente: Pedido }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const storedMessage = localStorage.getItem("successMessage");
    if (storedMessage) {
      setSuccessMessage(storedMessage);
      localStorage.removeItem("successMessage");
    }
  }, []);
  const handleDelete = async () => {
    try {
      // Eliminar el detalle de venta
      const detalleResponse = await fetch(`/api/deleteDetalleVenta`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_detalle_venta: cliente.id_detalle_venta }),
      });

      if (!detalleResponse.ok) {
        const detalleErrorData = await detalleResponse.json();
        alert(
          `Error eliminando el detalle de venta: ${detalleErrorData.error}`
        );
        return; // Salir si ocurre un error eliminando el detalle de venta
      }

      // Eliminar la venta
      const ventaResponse = await fetch(`/api/deleteVenta`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_venta: cliente.num_venta }),
      });

      if (!ventaResponse.ok) {
        const ventaErrorData = await ventaResponse.json();
        alert(`Error eliminando la venta: ${ventaErrorData.error}`);
        return; // Salir si ocurre un error eliminando la venta
      }

      // Mensaje de éxito y cierre del modal
      setSuccessMessage("Pedido eliminado correctamente"); // Muestra el mensaje
      setIsModalVisible(false); // Cierra el modal

      // Oculta el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
        router.refresh(); // Refresca la página
      }, 3000);
    } catch (error) {
      console.error("Error eliminando cliente y sus ventas:", error);
      alert("Ocurrió un error al intentar eliminar al cliente y sus ventas");
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
            onClick={() => navigator.clipboard.writeText(cliente.correo)}
          >
            Copiar correo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(cliente.telefono_movil)
            }
          >
            Copiar teléfono
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/comenunca/orders/${cliente.id_detalle_venta}`}>
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
            : `¿Estás seguro de que deseas eliminar el pedido?`
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

// Definición de columnas
export const columns: ColumnDef<Pedido>[] = [

  { accessorKey: "num_venta", header: "N° pedido" },
  {
    accessorKey: "cliente_rut",
    cell: ({ row }) => formatRut(row.original.cliente_rut),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        RUT
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorFn: (row) =>
      `${row.nombres} ${row.apellido_paterno} ${row.apellido_materno}`,
    id: "Nombre Completo",
  },

  {
    accessorKey: "telefono_movil",
    header: "Teléfono",
    cell: ({ row }) => {
      const telefono = row.original.telefono_movil;
      return telefono ? telefono.toString() : "Sin teléfono";
    },
  },
  { accessorKey: "nombre_producto", header: "Producto" },

  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) => {
      const value = row.original.precio;
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(value);
    },
  },


  { accessorKey: "estado", header: "Estado" },

  {
    id: "actions",
    cell: ({ row }) => <ClientActions cliente={row.original} />,
  },
];
