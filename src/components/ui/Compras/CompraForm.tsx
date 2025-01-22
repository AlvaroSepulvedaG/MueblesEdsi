//WIP

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
import CompraSchema from "@/components/ui/Compras/CompraSchema";
import Link from "next/link";
import { Modal } from "../modal";
//import OrderSchemaWithContext from "@/components/ui/Ventas/OrderSchema"; en revisión

interface CompraFormProps {
  num_compra?: number;
  nombre_proveedor?: string;
  telefono_proveedor?: number;
  correo_proveedor?: string;
  descripcion_compra?: string;
  monto_compra?: number;
  folio_documento?: number;
  fecha_compra?: Date;
  proveedor_rut_proveedor?: string;
  Documento_id_tipo_documento?: number;
  isEditable?: boolean;
  onComplete?: () => void;
}

export function CompraForm({
  num_compra,
  descripcion_compra,
  monto_compra,
  folio_documento,
  fecha_compra,
  proveedor_rut_proveedor,
  Documento_id_tipo_documento,
  isEditable = false,
  onComplete,
}: CompraFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const form = useForm<z.infer<typeof CompraSchema>>({
    resolver: zodResolver(CompraSchema),
    defaultValues: {
      numCompra: num_compra || undefined,
      descripcionCompra: descripcion_compra || undefined,
      montoCompra: monto_compra || undefined,
      folioDocumento: folio_documento || undefined,
      fechaCompra: fecha_compra || undefined,
      rutProveedor: proveedor_rut_proveedor || "",
      tipoDocumento: Documento_id_tipo_documento || undefined,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: z.infer<typeof CompraSchema>) {
    try {
      // Determinar si es una nueva orden o una actualización
      const isUpdating = isEditable && values.num_compra;

      if (isUpdating) {
        // Actualizar venta
        const updateResponse = await fetch(`/api/updateCompra`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            num_compra: values.numCompra,
            descripcion_compra: values.descripcionCompra,
            monto_compra: values.montoCompra,
            folio_documento: values.folioDocumento,
            fecha_compra: values.fechaCompra,
            proveedor_rut_proveedor: values.rutProveedor,
            Documento_id_tipo_documento: values.tipoDocumento,
          }),
        });

        if (!updateResponse.ok)
          throw new Error("Error al actualizar la compra");

        console.log("Compra actualizada correctamente.");
        setModalMessage(`Compra actualizada correctamente`);
      } else {
        // Crear nueva compra
        const createResponse = await fetch(`/api/addCompra`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            num_compra: values.numCompra,
            descripcion_compra: values.descripcionCompra,
            monto_compra: values.montoCompra,
            folio_documento: values.folioDocumento,
            fecha_compra: values.fechaCompra,
            proveedor_rut_proveedor: values.rutProveedor,
            Documento_id_tipo_documento: values.tipoDocumento,
          }),
        });

        if (!createResponse.ok) throw new Error("Error al crear la compra");

        const createData = await createResponse.json();
        console.log("Compra creado correctamente:", createData);
        setModalMessage(`Compra creado correctamente`);
      }

      setShowModal(true);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      setModalMessage(`Hubo un error al procesar la compra`);
      setShowModal(true);
    }
  }

  console.log(form.formState.errors);

  const handleEdit = () => setIsEditing(true);
  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/comenunca/compras");
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
            name="rutProveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT Proveedor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="RUT Proveedor"
                    {...field}
                    disabled={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
                control={form.control}
                name="descripcionCompra"
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de la Compra</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingrese descripción de la compra"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="montoCompra"
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Monto Compra"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="folioDocumento"
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° de Folio Documento</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ingrese el número de folio del documento de compra"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                    control={form.control}
                    name="fechaCompra"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fecha de la Compra</FormLabel>
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
                name="tipoDocumento"
                disabled={isEditable && !isEditing}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boleta o Factura</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ingrese si es boleta o factura"
                        {...field}
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
                  <Link href={"/comenunca/compras"}>Cancelar</Link>
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
