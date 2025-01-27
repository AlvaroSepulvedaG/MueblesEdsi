"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import OrderSchema from "@/components/ui/Ventas/OrderSchema";
import Link from "next/link";
import { Modal } from "../modal";
import OrderSchemaWithContext from "@/components/ui/Ventas/OrderSchema";

interface OrderFormProps {
  cliente_rut?: string;
  nombres: string;
  abono?: number;
  cod_producto?: string;
  num_venta?: number;

  id_detalle_venta?: number;
  fecha_estimada?: Date;
  direccion?: string;
  telefono_movil?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  isEditable?: boolean;
  rut?: string;
  productos?: Array<{
    nombre_producto: string;
    codigo_producto: string;
    precio: number;
    id_producto: number;
  }>;
  onComplete?: () => void;
}

export function OrderForm({
  abono,
  id_detalle_venta,
  cliente_rut,
  num_venta,
  fecha_estimada,
  productos = [],
  isEditable = false,
  onComplete,
}: OrderFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const form = useForm<z.infer<typeof OrderSchemaWithContext>>({
    resolver: zodResolver(OrderSchemaWithContext),
    defaultValues: {
      num_venta: num_venta || undefined,
      id_detalle_venta: id_detalle_venta || undefined,
      rutCliente: cliente_rut || "",
      items: productos.length
        ? productos.map((producto) => ({
            nombreProducto: producto.nombre_producto || "",
            codigoProducto: producto.codigo_producto || "",
            precio: producto.precio || undefined,
            id_producto: producto.id_producto || undefined,
          }))
        : [{ nombreProducto: "", codigoProducto: "", precio: undefined }],
      fechaEstimada: fecha_estimada || undefined,
      abono: abono || undefined,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: z.infer<typeof OrderSchema>) {
    try {
      // Determinar si es una nueva orden o una actualización
      const isUpdating = isEditable && values.num_venta;

      if (isUpdating) {
        // Actualizar venta
        const updateResponse = await fetch(`/api/updatePedido`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            num_venta: values.num_venta,
            id_detalle_venta: values.id_detalle_venta,
            cliente_rut: values.rutCliente,
            fecha_estimada: values.fechaEstimada,
            abono: values.abono,
            items: values.items.map((item) => ({
              nombre_producto: item.nombreProducto,
              codigo_producto: item.codigoProducto,
              precio: item.precio,
              producto_id_producto: item.id_producto,
            })),
          }),
        });

        if (!updateResponse.ok)
          throw new Error("Error al actualizar el pedido");

        console.log("Pedido actualizado correctamente.");
        setModalMessage(`Pedido actualizado correctamente`);
      } else {
        // Crear nueva orden
        const createResponse = await fetch(`/api/addPedido`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_rut: values.rutCliente,
            fecha_estimada: values.fechaEstimada,
            abono: values.abono,
            items: values.items.map((item) => ({
              nombre_producto: item.nombreProducto,
              codigo_producto: item.codigoProducto,
              precio: item.precio,
            })),
          }),
        });

        if (!createResponse.ok) throw new Error("Error al crear el pedido");

        const createData = await createResponse.json();
        console.log("Pedido creado correctamente:", createData);
        setModalMessage(`Pedido creado correctamente`);
      }

      setShowModal(true);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      setModalMessage(`Hubo un error al procesar el pedido`);
      setShowModal(true);
    }
  }

  console.log(form.formState.errors);

  const handleEdit = () => setIsEditing(true);
  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/comenunca");
    router.refresh();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[40vw]"
        >
          <FormField
            control={form.control}
            name="rutCliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT Cliente</FormLabel>
                <FormControl>
                  <Input
                    placeholder="RUT Cliente"
                    {...field}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <FormField
                control={form.control}
                name={`items.${index}.nombreProducto`}
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingrese nombre del producto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.codigoProducto`}
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código del Producto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingrese un código de producto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.precio`}
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Precio producto"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={() => remove(index)}
                disabled={isEditable && !isEditing}
                className="bg-red-600"
              >
                Eliminar Producto
              </Button>
            </div>
          ))}

          <Button
            type="button"
            disabled={isEditable && !isEditing}
            className={buttonVariants({
              variant: "es",
            })}
            onClick={() =>
              append({
                nombreProducto: "",
                codigoProducto: "",
                precio: 0,
                id_producto: 0,
              })
            }
          >
            Agregar Producto
          </Button>

          <FormField
            control={form.control}
            name="fechaEstimada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha estimada de entrega</FormLabel>
                <FormControl>
                  <DatePicker
                    field={field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="abono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abono</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Abono"
                    {...field}
                    disabled={isEditable && !isEditing}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditable && !isEditing ? (
            <div className="flex justify-between mb-10">
              <Button
                type="button"
                onClick={handleEdit}
                className="mb-10 bg-[#DC5F00]"
              >
                Editar
              </Button>
              <Button type="button" className="mb-10 bg-red-600">
                <Link href={"/comenunca/orders"}>Cancelar</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <Button type="submit" className="bg-[#DC5F00] mb-10">
                  {isEditable ? "Actualizar" : "Ingresar"}
                </Button>
                <Button type="button" className="bg-red-600">
                  <Link href={"/comenunca/orders"}>Cancelar</Link>
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
      <Modal
        isVisible={showModal}
        title="Notificación"
        message={modalMessage}
        onClose={handleCloseModal}
        autoCloseDuration={3000}
      />
    </>
  );
}
