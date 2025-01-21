"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";

export type Compras = {
  rut_proveedor: string;
  num_compra: number;
  descripcion_compra: string;
  monto_compra: number;
  folio_documento?: number;
  fecha_compra: string;
  id_tipo_documento: number;
};
interface DataTableProps<TData, TValue> {
  columns: Compras;
  data: TData[];
  rutProveedor?: string;
}



// Función para formatear el RUT
const formatRut = (rut_proveedor: string | undefined) => {
  if (!rut_proveedor) return "";
  // Remueve puntos y guiones
  let cleanRut = rut_proveedor.replace(/\./g, "").replace(/-/g, "");

  // Asegúrate de que tenga al menos 8 caracteres para evitar errores
  if (cleanRut.length < 9) return rut_proveedor;

  // Obtén el número y el dígito verificador
  const number = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);

  // Formatea el número con puntos y agrega el dígito verificador con un guión
  return `${number.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${verifier}`;
};

const SupplierActions = ({ proveedor }: { proveedor: Compras }) => {
  // Verifica el contenido de cliente
  console.log("Proveedor:", proveedor);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
};

/*
export const columns: ColumnDef<Compras, unknown>[] = [
  {
    accessorKey: "proveedor_rut_proveedor",
    cell: ({ row }) => formatRut(row.original.Proveedor_rut_proveedor),
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
    accessorKey: "precio_producto",
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
*/