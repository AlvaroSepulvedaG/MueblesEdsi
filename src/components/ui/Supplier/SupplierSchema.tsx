"use client";

import { z } from "zod";

const SupplierSchema = z.object({
  rut_proveedor: z.string().max(9, { message: "Máximo 9 caracteres" }),
  nombre_proveedor: z
    .string()
    .min(2, { message: "Demasiado corto" })
    .max(100, { message: "Máximo 100 caracteres" }),
  telefono_proveedor: z
    .number()
    .int()
    .min(10000000, { message: "Demasiado corto" })
    .max(999999999, { message: "Máximo 9 caracteres" })
    .optional(),
  correo_proveedor: z
    .string()
    .email({ message: "Correo inválido" })
    .min(6, { message: "Demasiado corto" })
    .max(50, { message: "Máximo 50 caracteres" }),
  comentarios: z
    .string()
    .max(1000, { message: "Máximo 1000 caracteres" })
    .optional(),
});

export default SupplierSchema;
