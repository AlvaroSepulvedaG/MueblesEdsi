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

interface ClientFormProps {
  rut?: string;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  direccion?: string;
  fecha_registro?: Date;
  correo?: string;
  telefono_movil?: number | null;
  comentarios?: string;
  isEditable?: boolean;
  comuna_id_comuna?: number;
  onComplete?: () => void;
}

export function ClientForm({
  rut,
  nombres,
  apellido_paterno,
  apellido_materno,
  direccion,
  fecha_registro,
  correo,
  telefono_movil,
  comentarios,
  comuna_id_comuna,
  isEditable = false,
  onComplete,
}: ClientFormProps) {
  const form = useForm<z.infer<typeof ClientSchema>>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      rut: rut || "",
      nombres: nombres || "",
      apellido_paterno: apellido_paterno || "",
      apellido_materno: apellido_materno || "",
      direccion: direccion || "",
      telefono_movil: telefono_movil ?? null, // Usa null en lugar de undefined
      correo: correo || "",
      comentarios: comentarios || "",
      fecha_registro: fecha_registro || undefined,
      comuna_id_comuna: comuna_id_comuna || undefined, // Default value for date
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

  async function onSubmit(values: z.infer<typeof ClientSchema>) {
    console.log("Datos que se van a enviar:", values); // Imprime los datos en la consola

    // Aplicamos el formato solo si fecha_registro tiene un valor
    const formData = {
      rut: values.rut, // RUT original
      nuevoRut: rut !== values.rut ? values.rut : undefined, // Enviar solo si cambia
      nombres: values.nombres,
      apellido_paterno: values.apellido_paterno,
      apellido_materno: values.apellido_materno,
      fecha_registro: values.fecha_registro,
      direccion: values.direccion,
      telefono_fijo: values.telefono_fijo,
      telefono_movil: values.telefono_movil,
      correo: values.correo,
      comentarios: values.comentarios,
      comuna_id_comuna: values.comuna_id_comuna || null,
    };

    try {
      // Determina el método HTTP a usar (POST para agregar, PUT para actualizar)
      const method = rut ? "PUT" : "POST";
      const endpoint = rut ? "/api/updateCliente" : "/api/addCliente";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${rut ? "update" : "add"} client`);
      }

      const data = await response.json();
      console.log(`Cliente ${rut ? "actualizado" : "agregado"}:`, data);
      setModalMessage(`Cliente ${rut ? "actualizado" : "agregado"}`);
      setShowModal(true);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error(`Error ${rut ? "updating" : "adding"} client:`, error);
      setModalMessage(`Error al ${rut ? "actualizar" : "agregar"} cliente`);
      setShowModal(true);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    router.push("/comenunca/clientes");
  };
  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/comenunca/clientes");
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
            name="rut"
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

          {/* Nombres Field */}
          <FormField
            control={form.control}
            name="nombres"
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
                  Puede ingresar uno o dos nombres según corresponda.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido Paterno Field */}
          <FormField
            control={form.control}
            name="apellido_paterno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Paterno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el apellido paterno"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido Materno Field */}
          <FormField
            control={form.control}
            name="apellido_materno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Materno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el apellido materno"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de registro Field */}
          <FormField
            control={form.control}
            name="fecha_registro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Registro</FormLabel>
                <FormControl>
                  <DatePicker
                    field={{
                      value: field.value,
                      onChange: (date: Date) => field.onChange(date),
                    }}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección Field */}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese la dirección"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comuna Field */}
          <FormField
            control={form.control}
            name="comuna_id_comuna"
            render={({ field }) => (
              <FormItem className="my-4">
                <FormLabel>Comuna</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="border rounded px-2 py-1 ml-4"
                    disabled={isEditable && !isEditing}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    } // Asegura que el valor sea un número o null
                    value={field.value ?? ""} // Establece el valor inicial al editar
                  >
                    <option value="">Seleccione una comuna</option>
                    {comunas.map((comuna) => (
                      <option key={comuna.id_comuna} value={comuna.id_comuna}>
                        {comuna.nombre_comuna}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono Móvil Field */}
          <FormField
            control={form.control}
            name="telefono_movil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Móvil</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ingrese el teléfono móvil"
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

          {/* Correo Field */}
          <FormField
            control={form.control}
            name="correo"
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

          {/* Comentarios Field */}
          <FormField
            control={form.control}
            name="comentarios"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentarios</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese comentarios adicionales"
                    {...field}
                    disabled={isEditable && !isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Otros campos... */}

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
                <Link href={"/comenunca/clientes"}>Cancelar</Link>
              </Button>
            </div>
          ) : (
            // Botón de Editar
            <>
              <div className="flex justify-between my-10 ">
                <Button type="submit" className="bg-[#DC5F00]">
                  {rut ? "Actualizar" : "Ingresar"}
                </Button>
                <Button type="button" className="bg-red-600">
                  <Link href={"/comenunca/clientes"}>Cancelar</Link>
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
