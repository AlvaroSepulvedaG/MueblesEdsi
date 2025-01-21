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

export type Proveedores = {
  rut_proveedor: string;
  nombre_proveedor: string;
  telefono_proveedor: number;
  correo_proveedor: string;
};

const SupplierActions = ({ proveedor }: { proveedor: Proveedores }) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<(() => void) | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  // Mostrar mensaje al cargar la página
  React.useEffect(() => {
    const storedMessage = localStorage.getItem("successMessage");
    if (storedMessage) {
      setSuccessMessage(storedMessage);
      localStorage.removeItem("successMessage");
    }
  }, []);
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/deleteProveedor`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut_proveedor: proveedor.rut_proveedor }),
      });

      if (response.ok) {
        setSuccessMessage("Proveedor eliminado correctamente"); // Muestra el mensaje
        setIsModalVisible(false); // Cierra el modal

        // Oculta el mensaje después de 3 segundos
        setTimeout(() => {
          setSuccessMessage(null);
          router.refresh(); // Refresca la página
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error eliminando proveedor:", error);
      alert("Ocurrió un error al intentar eliminar al proveedor");
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
    <div className="flex items-center justify-between">
      <Link href={`/comenunca/compras/nuevo?rut=${proveedor.rut_proveedor}`}>
        <Button
          className={buttonVariants({
            variant: "es",
          })}
        >
          Nueva Compra
        </Button>
      </Link>
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
              navigator.clipboard.writeText(proveedor.telefono_proveedor.toString())
            }
          >
            Copiar teléfono
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/comenunca/proveedores/${proveedor.rut_proveedor}`}>Editar</Link>
          </DropdownMenuItem>

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
            : `¿Estás seguro de que deseas eliminar al proveedor ${proveedor.nombre_proveedor}?`
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

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-md transition-opacity duration-300">
          {successMessage}
        </div>
      )}
    </div>
  );
};


// Definición de columnas
export const columns: ColumnDef<Proveedores>[] = [
  {
    // Combina nombres y apellidos en una sola columna
    accessorFn: (row) =>
      `${row.nombre_proveedor}`,
    id: "nombreCompleto", // Identificador único de la columna
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "rut_proveedor",
    header: "RUT",
    cell: ({ row }) => row.original.rut_proveedor
  },
  {
    accessorKey: "telefono_proveedor",
    header: "Teléfono",
    cell: ({ row }) => {
      const telefono = row.original.telefono_proveedor;
      return telefono ? telefono.toString() : "Sin teléfono";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SupplierActions proveedor={row.original} />,
  },
];
