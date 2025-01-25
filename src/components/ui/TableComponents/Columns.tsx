//rev

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

export type Pedidos = {
  rut: string;
  num_venta: number;
  id_detalle_venta: number;
  telefono_movil: string;
  nombres: string;
  email: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  cliente_rut: string;
  dirección?: string;
  precio: number;
  abono?: number;
  estado: string;
  id: number; // ID del pedido
  nombre_producto: string; // Nombre del producto
  precio_producto: number; // Precio del producto
  fecha_venta: string; // Fecha de la venta
};
interface DataTableProps<TData, TValue> {
  columns: Pedidos;
  data: TData[];
  rutCliente?: string;
}

//compras
export type Compras = {
  rut_proveedor: string;
  nombre_proveedor: string;
  telefono_proveedor: number;
  correo_proveedor: string;
  num_compra: number; 
  monto_compra: number;
  fecha_compra: string;
};

interface DataTablePropsCompras<TValue> {
  columns: Compras;
  data: Compras[];
  rutProveedor?: string;
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

const ClientActions = ({ cliente }: { cliente: Pedidos }) => {
  // Verifica el contenido de cliente
  console.log("Cliente:", cliente);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [estado, setEstado] = useState(cliente.estado);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeEstado = async () => {
    // Determina el siguiente estado
    let nuevoEstado = "";
    if (estado === "Pendiente") nuevoEstado = "En proceso";
    else if (estado === "En proceso") nuevoEstado = "Listo";
    else if (estado === "Listo") nuevoEstado = "Entregado";
    else if (estado === "0") nuevoEstado = "En proceso";
    setIsLoading(true);
    // Llama a la API para actualizar el estado en la base de datos
    try {
      const response = await fetch(`/api/updateDetalleVenta`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_detalle_venta: cliente.id_detalle_venta,
          estado: nuevoEstado,
        }),
      });

      if (response.ok) {
        location.reload();
        setEstado(nuevoEstado); // Actualiza el estado en la interfaz
      } else {
        console.error("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setIsLoading(false); // Ocultar spinner
    }
  };

  const handleDelete = async () => {
    try {
      // Eliminar el detalle de la venta basado en el id_detalle_venta
      const detalleResponse = await fetch(`/api/deleteDetalleVenta`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_detalle_venta: cliente.id_detalle_venta }), // Usar id_detalle_venta aquí
      });

      if (!detalleResponse.ok) {
        const detalleErrorData = await detalleResponse.json();
        return; // Salir si ocurre un error eliminando el detalle de venta
      }
      setSuccessMessage("Pedido eliminado correctamente");
      location.reload();
      setIsModalVisible(false);
      // Cierra el modal

      // Oculta el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
        // Refresca la página
      }, 3000);
    } catch (error) {
      console.error("Error eliminando el detalle de venta:", error);
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
    <div className="justify-center">
      <Button 
      variant="es"
      size="sm"
      onClick={handleChangeEstado}>
        
        Cambiar estado a{" "}
        {
          {
            Pendiente: "En proceso",
            pendiente: "En proceso",
            "En proceso": "Listo",
            Listo: "Entregado",
            Entregado: "Entregado", // Mantén el último estado sin cambio
          }[estado] || "Pendiente" // Estado por defecto si ninguno coincide
        }
      </Button>

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
            onClick={() => navigator.clipboard.writeText(cliente.email)}
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
      <Modal
        isVisible={isModalVisible}
        title={successMessage ? "Éxito" : "Confirmar eliminación"} // Cambia el título según el estado
        message={
          successMessage
            ? successMessage // Muestra el mensaje de éxito
            : `¿Estás seguro de que deseas eliminar el pedido ${cliente.cliente_rut}?`
        }
        onClose={closeModal}
        closeText={successMessage ? "Cerrar" : "Cancelar"}
      >
        {!successMessage && (
          <Button
            className="bg-red-500 text-white mt-4"
            onClick={() => {
              if (confirmAction) {
                confirmAction();
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
export const columns: ColumnDef<Pedidos, unknown>[] = [

  { accessorKey: "num_venta", header: "N° Pedido" },

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
