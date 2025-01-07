"use client";

import { z } from "zod";

const ClientSchema = z.object({
  rut: z.string().max(9, { message: "Máximo 9 caracteres" }),
  nombres: z
    .string()
    .min(2, { message: "Demasiado corto" })
    .max(100, { message: "Máximo 100 caracteres" }),
  apellido_paterno: z
    .string()
    .min(2, { message: "Demasiado corto" })
    .max(100, { message: "Máximo 100 caracteres" }),
  apellido_materno: z
    .string()
    .min(2, { message: "Demasiado corto" })
    .max(100, { message: "Máximo 100 caracteres" }),
  fecha_registro: z.date(),
  direccion: z
    .string()
    .min(2, { message: "Demasiado corto" })
    .max(200, { message: "Máximo 200 caracteres" }),
  telefono_fijo: z
    .number()
    .int()
    .min(10000000, { message: "Demasiado corto" })
    .max(999999999, { message: "Máximo 9 caracteres" })
    .optional(),
  telefono_movil: z
    .number({
      required_error: "El teléfono móvil es obligatorio",
      invalid_type_error: "El teléfono móvil debe ser un número",
    })
    .nullable(), // Permite null si el campo es opcional
  correo: z
    .string()
    .email({ message: "Correo inválido" })
    .min(6, { message: "Demasiado corto" })
    .max(50, { message: "Máximo 50 caracteres" }),
  comentarios: z
    .string()
    .max(1000, { message: "Máximo 1000 caracteres" })
    .optional(),
  comuna_id_comuna: z
    .number({
      required_error: "Debe seleccionar una comuna",
    })
    .int()
    .positive("Debe seleccionar una comuna válida"),
});

export default ClientSchema;
