"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ClientSchema from "@/components/ui/Clients/ClientSchema";
import { z } from "zod";
import { DatePicker } from "../DatePicker";
import Link from "next/link";
import { Modal } from "../modal";
import SupplierSchema from "./SupplierSchema";

interface SupplierFormProps {
  rut_proveedor?: string;
  nombre_proveedor?: string;
  telefono_proveedor?: number;
  correo_proveedor?: string;
  isEditable?: boolean;
  onComplete?: () => void;
}

export function SupplierForm({
  rut_proveedor,
  nombre_proveedor,
  telefono_proveedor,
  correo_proveedor,
  isEditable = false,
  onComplete,
}: SupplierFormProps) {
  const form = useForm<z.infer<typeof SupplierSchema>>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      rut_proveedor: rut_proveedor || "",
      nombre_proveedor: nombre_proveedor || "",
      telefono_proveedor: telefono_proveedor ?? null,
      correo_proveedor: correo_proveedor || "",
    },
  });

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [comunas, setComunas] = useState<
    { id_comuna: number; nombre_comuna: string }[]
  >([]);

  useEffect(() => {
    async function fetchComunas() {
      try {
        const response = await fetch("/api/getComunas");
        if (!response.ok) {
          throw new Error("Error al cargar las comunas");
        }
        const data = await response.json();
        setComunas(data); // Actualiza el estado con las comunas
      } catch (error) {
        console.error("Error al cargar las comunas:", error);
      }
    }
    fetchComunas();
  }, []);

  async function onSubmit(values: z.infer<typeof SupplierSchema>) {
    console.log("Datos que se van a enviar:", values); // Imprime los datos en la consola

    // Aplicamos el formato solo si fecha_registro tiene un valor
    const formData = {
      rut_proveedor: values.rut_proveedor, // RUT original
      nuevoRut: rut_proveedor !== values.rut_proveedor ? values.rut_proveedor : undefined, // Enviar solo si cambia
      nombre_proveedor: values.nombre_proveedor,
      telefono_proveedor: values.telefono_proveedor,
      correo_proveedor: values.correo_proveedor,
    };

    try {
      // Determina el método HTTP a usar (POST para agregar, PUT para actualizar)
      const method = rut_proveedor ? "PUT" : "POST";
      const endpoint = rut_proveedor ? "/api/updateProveedor" : "/api/addProveedor";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${rut_proveedor ? "update" : "add"} proveedor`);
      }

      const data = await response.json();
      console.log(`Proveedor ${rut_proveedor ? "actualizado" : "agregado"}:`, data);
      setModalMessage(`Proveedor ${rut_proveedor ? "actualizado" : "agregado"}`);
      setShowModal(true);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error(`Error ${rut_proveedor ? "updating" : "adding"} proveedor:`, error);
      setModalMessage(`Error al ${rut_proveedor ? "actualizar" : "agregar"} proveedor`);
      setShowModal(true);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    router.push("/comenunca/proveedores");
  };
  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/comenunca/proveedores");
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`${
            isEditable && !isEditing
              ? "grid grid-cols-2 gap-8 justify-center items-center"
              : "w-[40vw]"
          }`}
        >
          {/* RUT Field */}
          <FormField
            control={form.control}
            name="rut_proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUT</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456789"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormDescription>
                  Ingrese rut SIN puntos y SIN guión y dígito verificador.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre Proveedor Field */}
          <FormField
            control={form.control}
            name="nombre_proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormDescription>
                  Ingresar nombre completo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Teléfono Proveedor Field */}
          <FormField
            control={form.control}
            name="telefono_proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ingrese el teléfono"
                    {...field}
                    value={field.value ?? ""} // Convierte null a una cadena vacía
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Correo Proveedor Field */}
          <FormField
            control={form.control}
            name="correo_proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          {/* Submit Button */}
          {isEditable && !isEditing ? (
            <div className="flex flex-col gap-4 mt-5">
              <Button
                type="button"
                onClick={handleEdit}
                className="bg-[#DC5F00]"
              >
                Editar
              </Button>
              <Button type="button" className="bg-red-600">
                <Link href={"/comenunca/proveedores"}>Cancelar</Link>
              </Button>
            </div>
          ) : (
            // Botón de Editar
            <>
              <div className="flex justify-between my-10 ">
                <Button type="submit" className="bg-[#DC5F00]">
                  {rut_proveedor ? "Actualizar" : "Ingresar"}
                </Button>
                <Button type="button" className="bg-red-600">
                  <Link href={"/comenunca/proveedores"}>Cancelar</Link>
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
